'use server';

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  servicePrice: string;
  formattedDate: string;
  formattedTime: string;
  customerAddress: string;
  additionalInfo?: string;
}

export async function sendBookingConfirmationEmails(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      '[EMAIL WARNING] RESEND_API_KEY is not set. Email not sent. Booking details:',
      {
        to: data.customerEmail,
        service: data.serviceName,
        date: data.formattedDate,
        time: data.formattedTime,
      }
    );
    return { success: false, reason: 'RESEND_API_KEY not configured' };
  }

  try {
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'No Rush <bookings@norushservices.com>';
    const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'norushnyc@gmail.com';

    const sendResendEmail = async (to: string, subject: string, html: string) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Resend API error (${res.status}): ${errorText}`);
      }
      return res.json();
    };

    // 1. Email to the Customer
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Request Received - No Rush</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 24px; color: #1f2937;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
          <div style="background-color: #bd702d; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">No Rush</h1>
            <p style="color: #fde8d7; margin: 4px 0 0 0; font-size: 13px;">Professional Assembly & Moving • NYC</p>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="font-size: 20px; color: #111827; margin-top: 0;">We've received your booking request!</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
              Hi <strong>${data.customerName}</strong>, thank you for booking with No Rush. We have received your request and will reach out shortly via phone or email to confirm final details.
            </p>
            
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #f3f4f6;">
              <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; margin: 0 0 16px 0; letter-spacing: 0.5px;">Reservation Summary</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Service:</td>
                  <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Estimated Rate:</td>
                  <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #bd702d;">${data.servicePrice}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Date:</td>
                  <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Preferred Time:</td>
                  <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.formattedTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Location:</td>
                  <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.customerAddress}</td>
                </tr>
                ${data.additionalInfo ? `
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Notes:</td>
                  <td style="padding: 6px 0; text-align: right; color: #4b5563;">${data.additionalInfo}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
              Need to make a change or have urgent questions? Call or text us anytime at <a href="tel:9296372276" style="color: #bd702d; font-weight: 600;">(929) 637-2276</a>.
            </p>
          </div>
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} No Rush Services • New York City, NY
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. Alert Email to the Business/Admin
    const adminHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #bd702d;">🚨 New Booking Request Received</h2>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${data.customerPhone}">${data.customerPhone}</a></p>
        <p><strong>Service:</strong> ${data.serviceName} (${data.servicePrice})</p>
        <p><strong>Date & Time:</strong> ${data.formattedDate} at ${data.formattedTime}</p>
        <p><strong>Address:</strong> ${data.customerAddress}</p>
        ${data.additionalInfo ? `<p><strong>Additional Info:</strong> ${data.additionalInfo}</p>` : ''}
        <br/>
        <a href="https://norushservices.com/admin/dashboard" style="background:#bd702d; color:#fff; padding:10px 16px; text-decoration:none; border-radius:6px;">Open Admin Dashboard</a>
      </div>
    `;

    // Send customer email and admin notification concurrently
    await Promise.all([
      sendResendEmail(
        data.customerEmail,
        `Your No Rush Booking Request - ${data.serviceName}`,
        customerHtml
      ),
      sendResendEmail(
        adminNotificationEmail,
        `New Booking: ${data.serviceName} - ${data.customerName}`,
        adminHtml
      ),
    ]);

    return { success: true };
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send booking emails:', error);
    return { success: false, error };
  }
}
