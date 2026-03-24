import fs from 'fs'
import path from 'path'

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f)
    let isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8')
    let original = content
    content = content.replace(/(from\s+['"]|import\(['"])(\.\.?\/[^'"]+)(['"])/g, (match, prefix, p, suffix) => {
      if (!p.endsWith('.js') && !p.endsWith('.json')) {
        return `${prefix}${p}.js${suffix}`
      }
      return match
    })
    if (content !== original) {
      fs.writeFileSync(filePath, content)
      console.log('Fixed imports in', filePath)
    }
  }
})
