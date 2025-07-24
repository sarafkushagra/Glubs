import axios from "axios"

/**
 * Service for sending email notifications
 */
export const emailService = {
  /**
   * Send team invitation email
   * @param {Object} options - Email options
   * @param {string} options.recipientEmail - Recipient email address
   * @param {string} options.recipientName - Recipient name
   * @param {string} options.teamName - Team name
   * @param {string} options.eventName - Event name
   * @param {string} options.senderName - Sender name
   * @param {string} options.message - Optional personal message
   * @returns {Promise} - Promise resolving to the email send result
   */
  sendTeamInvitation: async (options) => {
    try {
      const { recipientEmail, recipientName, teamName, eventName, senderName, message } = options

      // HTML template for the email
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6366f1; margin-bottom: 10px;">Team Invitation</h1>
            <p style="color: #666; font-size: 16px;">You've been invited to join a team!</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${recipientName}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              <strong>${senderName}</strong> has invited you to join their team <strong>"${teamName}"</strong> for the event <strong>${eventName}</strong>.
            </p>
            ${
              message
                ? `
              <div style="background-color: #fff; padding: 15px; border-left: 4px solid #6366f1; margin-bottom: 20px; border-radius: 4px;">
                <p style="font-style: italic; color: #4b5563; margin: 0;">"${message}"</p>
              </div>
            `
                : ""
            }
          </div>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="http://localhost:3000/notifications" style="display: inline-block; background-color: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              View Invitation
            </a>
          </div>
          
          <div style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>This is an automated message from Glubs Event Management System.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      `

      // Send the email using the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/send-email`,
        {
          email: recipientEmail,
          subject: `Team Invitation: ${teamName} for ${eventName}`,
          html: htmlContent,
        },
        { withCredentials: true },
      )

      return response.data
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  },

  /**
   * Send team request response notification
   * @param {Object} options - Email options
   * @param {string} options.recipientEmail - Recipient email address
   * @param {string} options.recipientName - Recipient name
   * @param {string} options.teamName - Team name
   * @param {string} options.eventName - Event name
   * @param {string} options.responderName - Name of person who responded
   * @param {string} options.status - 'accepted' or 'rejected'
   * @returns {Promise} - Promise resolving to the email send result
   */
  sendTeamRequestResponse: async (options) => {
    try {
      const { recipientEmail, recipientName, teamName, eventName, responderName, status } = options

      const isAccepted = status === "accepted"
      const statusColor = isAccepted ? "#10b981" : "#ef4444"
      const statusText = isAccepted ? "accepted" : "rejected"

      // HTML template for the email
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: ${statusColor}; margin-bottom: 10px;">Team Invitation ${isAccepted ? "Accepted" : "Rejected"}</h1>
            <p style="color: #666; font-size: 16px;">Update on your team invitation</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${recipientName}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              <strong>${responderName}</strong> has ${statusText} your invitation to join team <strong>"${teamName}"</strong> for the event <strong>${eventName}</strong>.
            </p>
            ${
              isAccepted
                ? `
              <p style="font-size: 16px; margin-bottom: 10px;">
                They are now a member of your team. You can manage your team from the team room.
              </p>
            `
                : `
              <p style="font-size: 16px; margin-bottom: 10px;">
                You can invite other participants to join your team.
              </p>
            `
            }
          </div>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="http://localhost:3000/events/${options.eventId}/team-room" style="display: inline-block; background-color: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Go to Team Room
            </a>
          </div>
          
          <div style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>This is an automated message from Glubs Event Management System.</p>
          </div>
        </div>
      `

      // Send the email using the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/send-email`,
        {
          email: recipientEmail,
          subject: `Team Invitation ${isAccepted ? "Accepted" : "Rejected"}: ${teamName}`,
          html: htmlContent,
        },
        { withCredentials: true },
      )

      return response.data
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  },
}

export default emailService;
