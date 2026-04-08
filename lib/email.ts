/**
 * Email utility for sending transactional emails via Zepto Mail
 */

interface EmailRecipient {
  address: string;
  name?: string;
}

interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html: string;
  replyTo?: EmailRecipient;
}

export async function sendEmail(options: SendEmailOptions) {
  const zeptoApiKey = process.env.ZEPTO_MAIL_API_KEY;
  const fromEmail = process.env.ZEPTO_MAIL_FROM_EMAIL;

  if (!zeptoApiKey || !fromEmail) {
    console.error('Zepto Mail is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const toArray = Array.isArray(options.to)
      ? options.to
      : [options.to];

    const response = await fetch('https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: zeptoApiKey,
      },
      body: JSON.stringify({
        from: {
          address: fromEmail,
          name: 'StickModel',
        },
        to: toArray.map((recipient) => ({
          email_address: {
            address: recipient.address,
            name: recipient.name || 'User',
          },
        })),
        ...(options.replyTo && {
          reply_to: {
            address: options.replyTo.address,
            name: options.replyTo.name,
          },
        }),
        subject: options.subject,
        htmlbody: options.html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Zepto Mail API error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Email service error' };
  }
}

/**
 * Send email to admins when a user uploads a file
 */
export async function sendUserFileUploadNotification(
  projectName: string,
  userName: string,
  userEmail: string,
  fileName: string,
  stepLabel?: string
) {
  const adminEmails = process.env.ADMIN_EMAIL_RECIPIENTS?.split(',').map((e) =>
    e.trim()
  ) || [];

  if (adminEmails.length === 0) {
    console.warn('No admin emails configured');
    return;
  }

  const recipients: EmailRecipient[] = adminEmails.map((email) => ({
    address: email,
    name: 'StickModel Admin',
  }));

  const stepInfo = stepLabel ? ` for step "${stepLabel}"` : '';

  await sendEmail({
    to: recipients,
    subject: `📁 New File Upload: ${projectName}`,
    html: `
      <h2>New File Upload Notification</h2>
      <p><strong>Project:</strong> ${projectName}</p>
      <p><strong>User:</strong> ${userName} (${userEmail})</p>
      <p><strong>File Name:</strong> ${fileName}</p>
      ${stepInfo ? `<p><strong>Step:</strong> ${stepLabel}</p>` : ''}
      <hr />
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/requests/${projectName}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #ff5a1f;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        ">View Project</a>
      </p>
    `,
    replyTo: {
      address: userEmail,
      name: userName,
    },
  });
}

/**
 * Send email to user when admin uploads a deliverable
 */
export async function sendDeliverableUploadNotification(
  projectName: string,
  userName: string,
  userEmail: string,
  fileName: string,
  stepLabel?: string,
  cost?: number
) {
  const stepInfo = stepLabel ? ` for step "${stepLabel}"` : '';
  const costInfo = cost
    ? `<p><strong>Cost for this deliverable:</strong> $${cost.toLocaleString()}</p>`
    : '';

  await sendEmail({
    to: {
      address: userEmail,
      name: userName,
    },
    subject: `✅ Your Deliverable is Ready: ${projectName}`,
    html: `
      <h2>Your Deliverable is Ready!</h2>
      <p>Hi ${userName},</p>
      <p>Your deliverable for <strong>${projectName}</strong>${stepInfo} is now ready for download.</p>
      <p><strong>File:</strong> ${fileName}</p>
      ${costInfo}
      <hr />
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/home" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #ff5a1f;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        ">Download Your File</a>
      </p>
      <p style="font-size: 12px; color: #666;">
        If you have any questions, please reply to this email or contact us at shivansh@grizlabs.com
      </p>
    `,
  });
}
