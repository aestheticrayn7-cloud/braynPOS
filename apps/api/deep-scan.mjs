import fs from 'fs'
import path from 'path'

const report = {
  unboundedFindMany: [],
  loopsWithAwaitInTransaction: [],
  eventBusListenersInsideFunctions: [],
  missingRateLimits: [],
  missingMultiTenantModels: [],
  consoleLogs: [],
  jwtSecretHardcoded: [],
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f)
    let isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

// 1. Analyze Schema vs Multi-tenant extension
const schemaPath = './prisma/schema.prisma'
const extensionPath = './src/lib/prisma-multi-tenant.extension.ts'

if (fs.existsSync(schemaPath) && fs.existsSync(extensionPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8')
  const ext = fs.readFileSync(extensionPath, 'utf8')
  
  // Find all models with channelId
  const channelModels = []
  const modelRegex = /model\s+([A-Z][a-zA-Z0-9_]+)\s+{([^}]+)}/g
  let match
  while ((match = modelRegex.exec(schema)) !== null) {
    if (match[2].includes('channelId')) {
      channelModels.push(match[1])
    }
  }

  // Find models in ISOLATED_MODELS
  const isolatedRegex = /ISOLATED_MODELS\s*=\s*new\s*Set\(\[([^\]]+)\]\)/
  const isolatedMatch = isolatedRegex.exec(ext)
  const isolated = isolatedMatch ? isolatedMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, '')) : []

  const globalOptRegex = /GLOBAL_OPTIONAL_MODELS\s*=\s*new\s*Set\(\[([^\]]+)\]\)/
  const optMatch = globalOptRegex.exec(ext)
  const opts = optMatch ? optMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, '')) : []

  const dualRegex = /DUAL_CHANNEL_MODELS\s*=\s*new\s*Set\(\[([^\]]+)\]\)/
  const dualMatch = dualRegex.exec(ext)
  const duals = dualMatch ? dualMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, '')) : []

  const allHandled = new Set([...isolated, ...opts, ...duals])

  channelModels.forEach(m => {
    if (!allHandled.has(m)) {
      report.missingMultiTenantModels.push(m)
    }
  })
}

// 2. Analyze Codebase
walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.js')) return
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')

  let inTransaction = false
  let transactionDepth = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check for unbounded findMany
    if (line.includes('.findMany(') && !line.includes('take:') && !lines[i+1]?.includes('take:') && !lines[i+2]?.includes('take:') && !lines[i+3]?.includes('take:')) {
       // Check if there's any pagination
       const block = lines.slice(i, i+5).join(' ')
       if (!block.includes('take:')) {
           report.unboundedFindMany.push(`${filePath}:${i+1}`)
       }
    }

    // Check transaction await loops
    if (line.includes('$transaction(')) {
      inTransaction = true
      transactionDepth = 0
    }
    if (inTransaction) {
      if (line.includes('for (') && line.includes('of ')) {
        // Fast dumb check: if next 15 lines contain await
        const block = lines.slice(i, i+15).join(' ')
        if (block.includes(' await tx.')) {
          report.loopsWithAwaitInTransaction.push(`${filePath}:${i+1}`)
        }
      }
      if (line.includes('}')) transactionDepth--
      if (line.includes('{')) transactionDepth++
      if (transactionDepth < 0) inTransaction = false
    }

    // Event bus inside functions
    if (line.includes('eventBus.on(')) {
       // if it's deeply indented, might be inside a function / route
       if (line.match(/^\s{4,}/)) {
         report.eventBusListenersInsideFunctions.push(`${filePath}:${i+1}`)
       }
    }

    // Rate limits on routes
    if (line.includes('app.get(') || line.includes('app.post(') || line.includes('app.patch(') || line.includes('app.delete(')) {
       const block = lines.slice(i, i+10).join(' ')
       if (!block.includes('config:') && !block.includes('RATE.')) {
         report.missingRateLimits.push(`${filePath}:${i+1}`)
       }
    }

    // Hardcoded secrets
    if (line.includes('JWT_SECRET') && line.includes('= "')) {
       report.jwtSecretHardcoded.push(`${filePath}:${i+1}`)
    }
    
    // Console logs in prod paths
    if (line.includes('console.log(')) {
       report.consoleLogs.push(`${filePath}:${i+1}`)
    }
  }
})

fs.writeFileSync('./audit_report.json', JSON.stringify(report, null, 2))
console.log('Audit completed and written to audit_report.json')
