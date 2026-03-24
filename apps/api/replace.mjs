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
    content = content.replace(/prisma\.inventory_balances/g, 'prisma.inventoryBalance')
    content = content.replace(/tx\.inventory_balances/g, 'tx.inventoryBalance')
    content = content.replace(/inventory_balances:/g, 'inventoryBalances:')
    content = content.replace(/\.inventory_balances/g, '.inventoryBalances')
    content = content.replace(/'inventory_balances'/g, "'InventoryBalance'")
    if (content !== original) {
      fs.writeFileSync(filePath, content)
      console.log('Updated', filePath)
    }
  }
})
