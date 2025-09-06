// AI Service for integrating with DeepSeek AI
// This service handles communication with DeepSeek AI provider

interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}

class AIService {
  private providers: AIProvider[] = [];

  constructor() {
    // Initialize providers from environment variables
    if (process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      this.providers.push({
        name: 'deepseek',
        apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat'
      });
    }
  }

  async getAIResponse(message: string, context?: string): Promise<string> {
    console.log('AI Service called with message:', message);
    console.log('Available providers:', this.providers.map(p => p.name));

    if (this.providers.length === 0) {
      console.log('No providers configured, using mock response');
      // Fallback to mock responses if no providers configured
      return this.getMockResponse(message);
    }

    // Try each provider in order until one succeeds
    for (const provider of this.providers) {
      try {
        console.log(`Attempting to use ${provider.name} provider`);
        const response = await this.callProvider(provider, message, context);
        if (response) {
          console.log(`Success with ${provider.name}:`, response.substring(0, 100) + '...');
          return response;
        }
      } catch (error) {
        console.error(`Error with ${provider.name}:`, error);
        continue;
      }
    }

    // If all providers fail, return mock response
    console.log('All providers failed, using mock response');
    return this.getMockResponse(message);
  }

  private async callProvider(provider: AIProvider, message: string, context?: string): Promise<string> {
    const systemPrompt = `You are WOODY AI Assistant, an expert software developer specializing in web applications, mobile apps, and AI-powered solutions.

Key information about me:
- Professional software developer with expertise in modern technologies
- Specializes in React, Next.js, TypeScript, Python, and cloud technologies
- Experience with Supabase, PostgreSQL, AWS, and various AI integrations
- Focus on agile development practices and clean code principles

${context ? `Context: ${context}` : ''}

Please provide helpful, accurate responses about my projects, technical skills, and experience. Be professional, knowledgeable, and engaging.`;

    try {
      console.log(`Calling ${provider.name} API...`);

      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      console.log(`API Response Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      // Handle different response formats
      let content = null;

      // Standard OpenAI format
      if (data.choices?.[0]?.message?.content) {
        content = data.choices[0].message.content;
      }
      // Alternative format (some providers might use different structure)
      else if (data.choices?.[0]?.text) {
        content = data.choices[0].text;
      }
      // DeepSeek specific format
      else if (data.choices?.[0]?.delta?.content) {
        content = data.choices[0].delta.content;
      }
      // Fallback for any other format
      else if (data.content) {
        content = data.content;
      }
      else if (data.response) {
        content = data.response;
      }

      if (!content) {
        console.error('No content found in API response:', data);
        console.error('Available keys in response:', Object.keys(data));
        if (data.choices?.[0]) {
          console.error('Choice structure:', data.choices[0]);
        }
        throw new Error('No content in API response');
      }

      return content;
    } catch (error) {
      console.error(`Error calling ${provider.name}:`, error);
      throw error;
    }
  }

  private getMockResponse(message: string): string {
    const responses = [
      "I'd be happy to help you learn more about my projects and technical expertise!",
      "That's a great question about my work. Let me tell you about my experience with modern web technologies.",
      "I specialize in full-stack development with React, Next.js, and various backend technologies. What specific aspect interests you?",
      "My portfolio showcases projects in web development, mobile apps, and AI integration. Each project demonstrates different technical skills and problem-solving approaches.",
      "I have extensive experience with TypeScript, Python, and cloud technologies like AWS. I'm always excited to discuss technical implementations and best practices.",
      "As a professional developer, I focus on creating scalable, maintainable solutions using modern development practices and clean code principles.",
      "I'm passionate about leveraging AI and machine learning to create innovative solutions. My projects often incorporate cutting-edge technologies.",
      "Quality and user experience are paramount in my development approach. I believe in thorough testing, documentation, and continuous improvement."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Method to get context about projects and skills for better responses
  getContextInfo(): string {
    return `
My key projects include:
- Basketball League Management System (Next.js, Supabase, React Native)
- AI-Powered Portfolio Website (Next.js, TypeScript, Supabase)
- WOODY SOFTWARE DEVELOPMENT SERVICES (React, Node.js, AWS)

My technical skills include:
- Frontend: JavaScript/TypeScript, React/Next.js, Tailwind CSS
- Backend: Python, Node.js, PostgreSQL, Supabase
- Cloud: AWS, Docker
- AI/ML: Integration with various AI models and services
- Other: Git, Agile/Scrum, REST APIs, GraphQL

I have 5+ years of experience in full-stack development and specialize in modern web technologies.
    `.trim();
  }
}

export const aiService = new AIService();
