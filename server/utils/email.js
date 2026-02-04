import nodemailer from 'nodemailer';

export async function sendLeadEmail(leadData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const html = `
    <h2>New Lead Inquiry</h2>
    <p><strong>Name:</strong> ${leadData.name}</p>
    <p><strong>Email:</strong> ${leadData.email}</p>
    ${leadData.company ? `<p><strong>Company:</strong> ${leadData.company}</p>` : ''}
    ${leadData.phone ? `<p><strong>Phone:</strong> ${leadData.phone}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${leadData.message}</p>
    ${leadData.files?.length ? `<p><strong>Files:</strong> ${leadData.files.length} attachment(s)</p>` : ''}
    <p><small>Received at ${new Date().toLocaleString()}</small></p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Lead: ${leadData.name} - ${leadData.company || 'No Company'}`,
    html
  });
}
