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
  const { data, error } = await supabase
    .from('chat_interactions')
    .insert({
      session_id: sessionId,
      message,
      response
    })

  if (error) throw error
  return data
}

export const getChatHistory = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('chat_interactions')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}
