// Quick test script to verify DeepSeek API connection
require('dotenv').config({ path: '.env.local' });

async function testDeepSeekAPI() {
  const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error('❌ No DeepSeek API key found in .env.local');
    return;
  }

  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  console.log('🌐 Testing DeepSeek API connection...');

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Hello, this is a test message.'
          }
        ],
        max_tokens: 100
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, response.statusText);
      console.error('❌ Error Details:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('🎉 Success! AI Response:', data.choices[0].message.content);
    } else {
      console.log('⚠️ Unexpected response format:', data);
    }

  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testDeepSeekAPI();
