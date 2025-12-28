const http = require('http');

console.log('Testing AI Chatbot API...');

const testData = JSON.stringify({
  message: 'What is the capital of France?',
  conversationHistory: []
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/ai/gemini-placement-chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response received:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error('Request failed:', e.message);
});

req.write(testData);
req.end();