import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  const resetLink = `${BASE_URL}/auth/reset-password?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: "DailyEng <security@dailyeng.me>",
      to: email,  
      subject: "Reset Your Password - DailyEng",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">DailyEng</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px;">Your English Learning Companion</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px; font-weight: 600;">Reset Your Password</h2>
              <p style="color: #6b7280; margin: 0 0 24px; font-size: 15px; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
              </p>
              
              <!-- CTA Button -->
              <a href="${resetLink}" style="display: block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; text-align: center; margin-bottom: 24px;">
                Reset Password
              </a>
              
              <p style="color: #9ca3af; margin: 0 0 16px; font-size: 13px; line-height: 1.5;">
                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              
              <!-- Link fallback -->
              <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 20px;">
                <p style="color: #6b7280; margin: 0 0 8px; font-size: 12px;">Or copy and paste this link:</p>
                <p style="color: #8b5cf6; margin: 0; font-size: 12px; word-break: break-all;">${resetLink}</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} DailyEng. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Email service error:", error);
    return { success: false, error: "Failed to send email" };
  }
}
