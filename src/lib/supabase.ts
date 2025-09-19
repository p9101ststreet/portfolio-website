import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for portfolio data
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getSkills = async () => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category')
    .order('proficiency_level', { ascending: false })

  if (error) throw error
  return data
}

export const getFeaturedProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const saveChatInteraction = async (
  sessionId: string,
  message: string,
  response?: string
) => {
  try {
    console.log('Saving chat interaction:', { sessionId, messageLength: message.length, hasResponse: !!response });

    const { data, error } = await supabase
      .from('chat_interactions')
      .insert({
        session_id: sessionId,
        message,
        response,
        timestamp: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Supabase save error:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });

      // Don't throw the error to avoid breaking the chat flow
      // Just log it and return null
      return null;
    }

    console.log('Successfully saved chat interaction:', data?.[0]?.id);
    return data;
  } catch (dbError) {
    console.error('Database error in saveChatInteraction:', {
      error: dbError,
      message: dbError instanceof Error ? dbError.message : String(dbError),
      sessionId,
      messagePreview: message.substring(0, 50) + '...'
    });
    return null;
  }
}

export const getChatHistory = async (sessionId: string) => {
  try {
    console.log('Loading chat history for session:', sessionId);

    const { data, error } = await supabase
      .from('chat_interactions')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase getChatHistory error:', {
        error,
        code: error.code,
        message: error.message,
        sessionId
      });
      throw error;
    }

    console.log(`Loaded ${data?.length || 0} chat interactions for session ${sessionId}`);
    return data || [];
  } catch (dbError) {
    console.error('Database error in getChatHistory:', {
      error: dbError,
      message: dbError instanceof Error ? dbError.message : String(dbError),
      sessionId
    });
    // Return empty array instead of throwing to avoid breaking the UI
    return [];
  }
}
