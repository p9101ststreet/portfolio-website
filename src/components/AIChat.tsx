'use client';

import { useState, useRef, useEffect } from 'react';
import { saveChatInteraction, getChatHistory } from '@/lib/supabase';
import { aiService } from '@/lib/ai-service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(sessionId);
      const formattedMessages: Message[] = history.flatMap((interaction) => [
        {
          id: `user_${interaction.id}`,
          role: 'user',
          content: interaction.message,
          timestamp: new Date(interaction.timestamp)
        },
        ...(interaction.response ? [{
          id: `assistant_${interaction.id}`,
          role: 'assistant' as const,
          content: interaction.response,
          timestamp: new Date(interaction.timestamp)
        }] : [])
      ]);
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Here we'll integrate with DeepSeek AI and xAI Grok
      const response = await getAIResponse(message);

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to database
      await saveChatInteraction(sessionId, message, response);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorType = error instanceof Error ? error.constructor.name : typeof error;

      console.error('Detailed error sending message:', {
        error,
        message: errorText,
        stack: errorStack,
        type: errorType,
        timestamp: new Date().toISOString()
      });

      // More specific error handling based on error type
      let errorContent = 'Sorry, I encountered an error. Please try again.';

      if (errorText.includes('network') || errorText.includes('fetch') || errorText.includes('Failed to fetch')) {
        errorContent = 'Network error. Please check your connection and try again.';
      } else if (errorText.includes('API') || errorText.includes('response') || errorText.includes('status')) {
        errorContent = 'AI service temporarily unavailable. Please try again shortly.';
      } else if (errorText.includes('timeout') || errorText.includes('aborted')) {
        errorContent = 'Request timed out. Please try again.';
      } else if (errorText.includes('rate limit') || errorText.includes('429')) {
        errorContent = 'Too many requests. Please wait a moment and try again.';
      }

      const errorMessageObj: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (message: string): Promise<string> => {
    try {
      // Get context information for better AI responses
      const context = aiService.getContextInfo();

      // Call the AI service with context
      return await aiService.getAIResponse(message, context);
    } catch (error) {
      console.error('AI Response Error:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Authentication failed')) {
          return '❌ API Key Error: Please check your DeepSeek API key configuration.';
        } else if (error.message.includes('Rate limit')) {
          return '⏱️ Rate Limit: Too many requests. Please wait a moment and try again.';
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
          return '🌐 Network Error: Please check your internet connection and try again.';
        } else if (error.message.includes('Server error')) {
          return '🛠️ Server Error: The AI service is temporarily unavailable. Please try again later.';
        }
      }

      return '🤖 AI Service Error: Something went wrong. Please try again or contact support if the issue persists.';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                WOODY AI Assistant
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ask me about projects, tech stack, or experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">Welcome to WOODY AI Assistant!</p>
              <p className="text-sm">Ask me anything about my projects, technical skills, or experience.</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about my projects, skills, or experience..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
