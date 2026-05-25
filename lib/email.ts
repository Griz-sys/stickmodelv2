/**
 * Email utility for sending transactional emails via Zepto Mail
 */

interface EmailRecipient {
  address: string;
  name?: string;
}

interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  bcc?: EmailRecipient | EmailRecipient[];
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
        ...(options.bcc && {
          bcc: (Array.isArray(options.bcc) ? options.bcc : [options.bcc]).map((recipient: EmailRecipient) => ({
            email_address: {
              address: recipient.address,
              name: recipient.name || recipient.address,
            },
          })),
        }),
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
        If you have any questions, please reply to this email or contact us at info@stickmodel.com
      </p>
    `,
  });
}

/**
 * Send email to admins when a user requests a new step
 */
export async function sendStepRequestNotification(
  projectId: string,
  projectName: string,
  userName: string,
  userEmail: string,
  stepLabel: string,
  fileName?: string,
  budgetNote?: string
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

  const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/requests/${projectId}`;

  await sendEmail({
    to: recipients,
    subject: `🆕 Step Request: ${projectName}`,
    html: `
      <h2>New Step Request from Client</h2>
      <p><strong>Project:</strong> ${projectName}</p>
      <p><strong>Client:</strong> ${userName} (${userEmail})</p>
      <p><strong>Step Name:</strong> ${stepLabel}</p>
      ${fileName ? `<p><strong>File Attached:</strong> ${fileName}</p>` : '<p><strong>File:</strong> None uploaded</p>'}
      ${budgetNote ? `<p><strong>Client Budget Note:</strong> ${budgetNote}</p>` : ''}
      <hr />
      <p>Please review and set charges for this step.</p>
      <p>
        <a href="${projectUrl}" style="
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
 * Send email to admins when a user adds/updates a note on their project
 */
export async function sendNoteAddedNotification(
  projectId: string,
  projectName: string,
  userName: string,
  userEmail: string,
  note: string
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

  const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/requests/${projectId}`;
  const escapedNote = note
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');

  await sendEmail({
    to: recipients,
    subject: `📝 New Note from Client: ${projectName}`,
    html: `
      <h2>Client Added a Note</h2>
      <p><strong>Project:</strong> ${projectName}</p>
      <p><strong>Client:</strong> ${userName} (${userEmail})</p>
      <p><strong>Note:</strong></p>
      <blockquote style="border-left: 3px solid #ff5a1f; padding-left: 12px; color: #444;">${escapedNote}</blockquote>
      <hr />
      <p>
        <a href="${projectUrl}" style="
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
 * Send email to admins when a user downloads a deliverable
 */
export async function sendDeliverableDownloadNotification(
  projectId: string,
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

  const stepInfo = stepLabel ? ` (step: "${stepLabel}")` : '';
  const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/requests/${projectId}`;

  await sendEmail({
    to: recipients,
    subject: `⬇️ Deliverable Downloaded: ${projectName}`,
    html: `
      <h2>Deliverable Download Notification</h2>
      <p><strong>Project:</strong> ${projectName}</p>
      <p><strong>User:</strong> ${userName} (${userEmail})</p>
      <p><strong>File Downloaded:</strong> ${fileName}${stepInfo}</p>
      <hr />
      <p>
        <a href="${projectUrl}" style="
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
 * Send email to user when admin marks project as finished
 */
export async function sendProjectFinishedNotification(
  projectName: string,
  userName: string,
  userEmail: string,
  customSubject?: string,
  customBody?: string,
  ccEmails?: string
) {
  const subject = customSubject || `Your project "${projectName}" is complete!`;

  let htmlBody: string;
  if (customBody) {
    const escapedBody = customBody
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br />');
    htmlBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <p>${escapedBody}</p>
    </div>`;
  } else {
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2>Your Project is Complete!</h2>
        <p>Hi ${userName},</p>
        <p>Your project <strong>${projectName}</strong> has been completed and is ready for download.</p>
        <hr />
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/home" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff5a1f;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">View Your Project</a>
        </p>
        <p style="font-size: 12px; color: #666;">
          If you have any questions, please contact us at info@stickmodel.com
        </p>
      </div>
    `;
  }

  const bccRecipients: EmailRecipient[] = ccEmails
    ? ccEmails.split(',').map((e) => e.trim()).filter(Boolean).map((address) => ({ address }))
    : [];

  await sendEmail({
    to: { address: userEmail, name: userName },
    subject,
    html: htmlBody,
    ...(bccRecipients.length > 0 && { bcc: bccRecipients }),
  });
}
