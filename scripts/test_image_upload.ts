import axios from 'axios';

async function testCreateItemWithImage() {
  const token = 'YOUR_TOKEN_HERE'; // I need a token or bypass auth for testing
  const baseUrl = 'http://localhost:4000/v1';

  // This is a 1x1 transparent PNG Base64
  const smallImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhAF/pos97AAAAABJRU5ErkJggg==';

  try {
    console.log('Testing with small image (Base64)...');
    const res = await axios.post(`${baseUrl}/items`, {
      name: 'Test Item with Image',
      retailPrice: 100,
      weightedAvgCost: 50,
      imageUrl: smallImage
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err: any) {
    console.error('Failed:', err.response?.data || err.message);
  }
}

// I can't really run this without a token. 
// But I can check the code and see it's obviously wrong.
