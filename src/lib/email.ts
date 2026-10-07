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

// ==================== Status-Change Emails ====================

export async function sendBookingStatusConfirmationEmail(data: {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  formattedDate: string;
  formattedTime: string;
  customerAddress: string;
  additionalInfo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      '[EMAIL WARNING] RESEND_API_KEY not set. Booking confirmation email not sent to:',
      data.customerEmail
    );
    return { success: false, reason: 'RESEND_API_KEY not configured' };
  }

  try {
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'No Rush <bookings@norushservices.com>';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [data.customerEmail],
        subject: `Great News! Your No Rush Booking Has Been Confirmed`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Booking Confirmed - No Rush</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f6f6; margin: 0; padding: 24px; color: #1f2937;">
  <div style="max-width: 580px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">

    <!-- Header -->
    <div style="background-color: #2d8a3e; padding: 24px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">No Rush</h1>
      <p style="color: #d4f0e2; margin: 4px 0 0 0; font-size: 13px;">Professional Assembly & Moving • NYC</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px;">
      <h2 style="font-size: 20px; color: #111827; margin-top: 0;">Your Booking Has Been Confirmed!</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
        Hi <strong>${data.customerName}</strong>, great news! Your booking for <strong>${data.serviceName}</strong> has been confirmed. Here are your details:
      </p>

      <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #bbf7d0;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; margin: 0 0 16px 0; letter-spacing: 0.5px;">Confirmation Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280;">Service:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.serviceName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Date:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.formattedDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Time:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.formattedTime}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Location:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.customerAddress}</td></tr>
          ${data.additionalInfo ? `<tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Notes:</td><td style="padding: 6px 0; text-align: right; color: #4b5563;">${data.additionalInfo}</td></tr>` : ''}
        </table>
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
        Our team will arrive at the scheduled time to handle your booking. If you need to make any changes or have questions, please don't hesitate to reach out:
      </p>
      <p style="font-size: 14px; margin-top: 8px;">
        Call or text us anytime at <a href="tel:9296372276" style="color: #2d8a3e; font-weight: 600;">(929) 637-2276</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
      &copy; ${new Date().getFullYear()} No Rush Services &bull; New York City, NY
    </div>

  </div>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Resend API error (${res.status}): ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendBookingCancellationEmail(data: {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  formattedDate: string;
  formattedTime: string;
  customerAddress: string;
  additionalInfo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      '[EMAIL WARNING] RESEND_API_KEY not set. Cancellation email not sent to:',
      data.customerEmail
    );
    return { success: false, reason: 'RESEND_API_KEY not configured' };
  }

  try {
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'No Rush <bookings@norushservices.com>';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [data.customerEmail],
        subject: `No Rush Booking Cancelled - ${data.serviceName}`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Booking Cancelled - No Rush</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f6f6; margin: 0; padding: 24px; color: #1f2937;">
  <div style="max-width: 580px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">

    <!-- Header -->
    <div style="background-color: #b91c1c; padding: 24px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">No Rush</h1>
      <p style="color: #fecaca; margin: 4px 0 0 0; font-size: 13px;">Professional Assembly & Moving • NYC</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px;">
      <h2 style="font-size: 20px; color: #b91c1c; margin-top: 0;">Your Booking Has Been Cancelled</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
        Hi <strong>${data.customerName}</strong>, unfortunately your booking for <strong>${data.serviceName}</strong> has been cancelled. Here are the details of what was cancelled:
      </p>

      <div style="background-color: #fef2f2; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #fecaca;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; margin: 0 0 16px 0; letter-spacing: 0.5px;">Cancelled Booking Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280;">Service:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.serviceName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Date:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.formattedDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Time:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.formattedTime}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Location:</td><td style="padding: 6px 0; font-weight: 600; text-align: right; color: #111827;">${data.customerAddress}</td></tr>
          ${data.additionalInfo ? `<tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Notes:</td><td style="padding: 6px 0; text-align: right; color: #4b5563;">${data.additionalInfo}</td></tr>` : ''}
        </table>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 8px;">
        We apologize for any inconvenience this may cause. If you'd like to schedule a new booking or have any questions, please feel free to reach out:
      </p>
      <p style="font-size: 14px; margin-top: 8px;">
        Call or text us anytime at <a href="tel:9296372276" style="color: #b91c1c; font-weight: 600;">(929) 637-2276</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
      &copy; ${new Date().getFullYear()} No Rush Services &bull; New York City, NY
    </div>

  </div>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Resend API error (${res.status}): ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send cancellation email:', error);
    return { success: false, error };
  }
}
