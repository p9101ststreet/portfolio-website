import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const deepseekKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return NextResponse.json({
    environment_check: {
      deepseek_api_key_exists: !!deepseekKey,
      deepseek_api_key_length: deepseekKey?.length || 0,
      deepseek_api_key_prefix: deepseekKey?.substring(0, 3) || 'N/A',
      supabase_url_exists: !!supabaseUrl,
      node_env: process.env.NODE_ENV,
      all_env_keys: Object.keys(process.env).filter(key =>
        key.includes('DEEPSEEK') || key.includes('SUPABASE') || key.includes('NEXT_PUBLIC')
      )
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Test DeepSeek API directly
    const deepseekKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

    if (!deepseekKey) {
      return NextResponse.json({
        error: 'DeepSeek API key not found',
        status: 'missing_key'
      }, { status: 500 });
    }

    console.log('Testing DeepSeek API with key:', deepseekKey.substring(0, 10) + '...');

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Keep responses brief.'
          },
          {
            role: 'user',
            content: message || 'Hello, this is a test message.'
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    const data = await response.json();

    return NextResponse.json({
      api_response: {
        status: response.status,
        statusText: response.statusText,
        data: data,
        success: response.ok
      },
      test_message: message || 'Hello, this is a test message.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug API test error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'api_error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
