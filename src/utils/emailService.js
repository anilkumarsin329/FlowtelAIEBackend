const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email connection failed:", error.message);
  } else {
    console.log("✅ Email service ready");
  }
});

const formatDate = (date) => {
  if (!date) return "Date not specified";
  const [year, month, day] = date.split("-");
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sendMeetingConfirmation = async (data) => {
  console.log("📧 Sending meeting confirmation...");
  try {
    const { name, email, phone, date, time, message } = data;

    if (!email || !name) throw new Error("Required fields missing");

    const formattedDate = formatDate(date);

    await transporter.sendMail({
      from: `"FlowtelAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Meeting Request Received - FlowtelAI",
      html: `
        <h2>Meeting Request Received</h2>
        <p>Dear ${name},</p>
        <p>Your meeting request has been received.</p>
        <p><b>Date:</b> ${formattedDate}</p>
        <p><b>Time:</b> ${time || "Not specified"}</p>
        <p><b>Phone:</b> ${phone || "Not provided"}</p>
        ${message ? `<p><b>Message:</b> ${message}</p>` : ""}
        <p>We will contact you shortly.</p>
        <br/>
        <b>FlowtelAI Team</b>
      `,
    });

    await transporter.sendMail({
      from: `"FlowtelAI" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Meeting Request - ${name}`,
      html: `
        <h3>New Meeting Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Date:</b> ${formattedDate}</p>
        <p><b>Time:</b> ${time || "N/A"}</p>
      `,
    });

    console.log("✅ Meeting confirmation emails sent");
    return true;
  } catch (error) {
    console.error("❌ Email error:", error.message);
    return false;
  }
};

const sendMeetingUpdateEmail = async (data) => {
  console.log("📧 Sending meeting update...");
  try {
    const { email, name, oldDate, newDate, oldTime, newTime } = data;

    await transporter.sendMail({
      from: `"FlowtelAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Meeting Updated - FlowtelAI",
      html: `
        <h2>Meeting Updated</h2>
        <p>Dear ${name},</p>
        <p><b>Old Date:</b> ${formatDate(oldDate)}</p>
        <p><b>Old Time:</b> ${oldTime || "N/A"}</p>
        <hr/>
        <p><b>New Date:</b> ${formatDate(newDate)}</p>
        <p><b>New Time:</b> ${newTime || "N/A"}</p>
        <br/>
        <b>FlowtelAI Team</b>
      `,
    });

    console.log("✅ Update email sent");
    return true;
  } catch (error) {
    console.error("❌ Update email error:", error.message);
    return false;
  }
};

const sendMeetingCancellationEmail = async (data) => {
  console.log("📧 Sending meeting cancellation...");
  try {
    const { email, name, date, time, reason } = data;

    await transporter.sendMail({
      from: `"FlowtelAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Meeting Cancelled - FlowtelAI",
      html: `
        <h2>Meeting Cancelled</h2>
        <p>Dear ${name},</p>
        <p>Your meeting has been cancelled.</p>
        <p><b>Date:</b> ${formatDate(date)}</p>
        <p><b>Time:</b> ${time || "N/A"}</p>
        <p><b>Reason:</b> ${reason || "Not specified"}</p>
        <br/>
        <b>FlowtelAI Team</b>
      `,
    });

    console.log("✅ Cancellation email sent");
    return true;
  } catch (error) {
    console.error("❌ Cancellation email error:", error.message);
    return false;
  }
};

module.exports = {
  sendMeetingConfirmation,
  sendMeetingUpdateEmail,
  sendMeetingCancellationEmail,
};
