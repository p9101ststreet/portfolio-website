import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
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
