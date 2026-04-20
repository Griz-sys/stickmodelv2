import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ZEPTO_MAIL_API_KEY;
    const fromEmail = process.env.ZEPTO_MAIL_FROM_EMAIL;
    const adminEmails = process.env.ADMIN_EMAIL_RECIPIENTS || "";

    if (!apiKey || !fromEmail || !adminEmails) {
      console.error("Missing email configuration", {
        hasApiKey: !!apiKey,
        hasFromEmail: !!fromEmail,
        hasAdminEmails: !!adminEmails,
      });
      return NextResponse.json(
        { error: "Email service configuration missing" },
        { status: 500 }
      );
    }

    // Parse admin emails
    const toEmailArray = adminEmails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    if (toEmailArray.length === 0) {
      return NextResponse.json(
        { error: "No admin email recipients configured" },
        { status: 500 }
      );
    }

    // Format email body
    const emailBody = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #E67E00;">New Contact Form Submission</h2>
  
  <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #E67E00;">
    <p><strong>From:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3>Message:</h3>
    <p style="white-space: pre-wrap; line-height: 1.6;">${message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  <p style="font-size: 12px; color: #666;">
    This is an automated message from StickModel contact form.
    <br>
    <strong>Reply To:</strong> ${email}
  </p>
</div>
    `.trim();

    const payload = {
      from: {
        address: fromEmail,
        name: "StickModel",
      },
      to: toEmailArray.map((emailAddr) => ({
        email_address: {
          address: emailAddr,
          name: "Admin",
        },
      })),
      subject: `New Contact Form: ${subject}`,
      htmlbody: emailBody,
      ...(email && {
        reply_to: {
          address: email,
          name: name,
        },
      }),
    };

    console.log("Sending email with payload:", {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
    });

    // Send email via Zepto Mail
    const response = await fetch("https://api.zeptomail.in/v1.1/email", {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    console.log("Zepto Mail Response Status:", response.status);
    console.log("Zepto Mail Response Data:", responseData);

    if (!response.ok) {
      console.error("Zepto Mail API error:", {
        status: response.status,
        data: responseData,
      });
      
      let errorDetail = "Unknown error";
      if (typeof responseData.error === "string") {
        errorDetail = responseData.error;
      } else if (typeof responseData.message === "string") {
        errorDetail = responseData.message;
      } else if (responseData.error && typeof responseData.error === "object") {
        errorDetail = JSON.stringify(responseData.error);
      }
      
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: errorDetail,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        messageId: responseData.data?.message_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
