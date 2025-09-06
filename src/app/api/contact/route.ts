import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Initialize SendGrid
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    if (!sendGridApiKey || !fromEmail) {
      console.error('SendGrid configuration missing');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    sgMail.setApiKey(sendGridApiKey);

    // Email content
    const msg = {
      to: fromEmail, // Send to yourself
      from: fromEmail, // Must be verified sender in SendGrid
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; color: #4b5563;">${message}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #6b7280; font-size: 14px;">
            This message was sent from your portfolio website contact form.
          </p>
        </div>
      `,
      replyTo: email, // Allow replying directly to the sender
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);

    // Handle SendGrid specific errors
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Email service authentication failed' },
          { status: 500 }
        );
      }
      if (error.message.includes('Forbidden')) {
        return NextResponse.json(
          { error: 'Email service access denied' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
