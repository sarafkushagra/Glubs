const { Resend } = require("resend");

const sendEmail = async (options) => {
  try {
    // Initialize Resend with API key from environment variables
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email using Resend API
    const { data, error } = await resend.emails.send({
      from: "GLUBS Team 👨‍💻 <onboarding@medhya.life>",
      to: [options.email],
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    });

    // Handle Resend API errors
    if (error) {
      console.error("❌ Actual email error:", error);
      throw error;
    }

    console.log("✅ Email sent:", data);
  } catch (err) {
    console.error("❌ Actual email error:", err);
    throw err;
  }
};

module.exports = sendEmail;