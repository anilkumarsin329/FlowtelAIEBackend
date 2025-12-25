// Test Authentication Examples

// 1. Using curl command to test protected routes:

// Without authentication (should fail):
// curl http://localhost:3001/api/demo

// With correct authentication:
// curl -u admin:flowtel123 http://localhost:3001/api/demo

// 2. Using JavaScript fetch with Basic Auth:

const testWithAuth = async () => {
  const username = 'admin';
  const password = 'flowtel123';
  const credentials = btoa(`${username}:${password}`);
  
  try {
    const response = await fetch('http://localhost:3001/api/demo', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      console.log('Failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// 3. Using Postman:
// - Set Authorization type to "Basic Auth"
// - Username: admin
// - Password: flowtel123

// 4. Current credentials:
// Username: admin
// Password: flowtel123

console.log('Authentication is now enabled!');
console.log('Protected routes: GET /api/demo, GET /api/newsletter');
console.log('Public routes: POST /api/demo, POST /api/newsletter');