import { itemsService } from './src/modules/items/items.service'

async function verifyDeDuplication() {
  console.log('--- VERIFYING CATEGORY DE-DUPLICATION ---')
  
  // HQ Channel ID from previous steps
  const hqChannelId = '1a645410-a2e3-4228-aa8c-76e938f364de'
  
  const categories = await itemsService.findAllCategories(hqChannelId)
  console.log('TOTAL_CATEGORIES_RETURNED:', categories.length)
  
  const electronics = categories.filter(c => c.name === 'Electronics')
  console.log('ELECTRONICS_COUNT:', electronics.length)
  if (electronics.length === 1) {
    console.log('SUCCESS: Only one Electronics category returned.')
    console.log('ID:', electronics[0].id)
    console.log('ChannelID:', electronics[0].channelId)
  } else {
    console.log('FAILURE: Expected 1 Electronics category, got', electronics.length)
    electronics.forEach(e => console.log(`- ID: ${e.id}, ChannelID: ${e.channelId}`))
  }
}

verifyDeDuplication().catch(console.error)
