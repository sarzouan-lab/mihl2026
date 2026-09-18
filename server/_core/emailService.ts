import nodemailer from "nodemailer";

const SPOND_INVITE_URL = "https://spond.com/invite/XCNVP";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables are required"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

async function send(to: string, subject: string, html: string, text: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Menshes Ice Hockey League" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

export async function sendApprovalEmail(
  toEmail: string,
  firstName: string,
  paymentPlan: "full" | "split",
  paymentStatus: "unpaid" | "deposit_paid" | "paid_in_full"
) {
  const subject = "You're approved — join the MIHL Spond group";
  const paymentReminder =
    paymentStatus === "paid_in_full"
      ? ""
      : paymentPlan === "split"
      ? "\n\nReminder: your first payment ($450) is due by September 11th, and your second payment ($425) is due by December 19th. If you haven't sent your first payment yet, please make sure it's in by September 11th. Payment by e-transfer to payments@mihl.ca."
      : "\n\nReminder: if you haven't sent your full payment ($850) yet, please make sure it's in by September 11th. Payment by e-transfer to payments@mihl.ca.";

  const paymentReminderHtml =
    paymentStatus === "paid_in_full"
      ? ""
      : paymentPlan === "split"
      ? `<p><strong>Reminder:</strong> your first payment ($450) is due by <strong>September 11th</strong>, and your second payment ($425) is due by December 19th. If you haven't sent your first payment yet, please make sure it's in by September 11th. Payment by e-transfer to payments@mihl.ca.</p>`
      : `<p><strong>Reminder:</strong> if you haven't sent your full payment ($850) yet, please make sure it's in by <strong>September 11th</strong>. Payment by e-transfer to payments@mihl.ca.</p>`;

  const text = `Hi ${firstName},

You've been approved to play in the Menshes Ice Hockey League 2026-27 season.

Join our Spond group here to see your team, schedule, and roster:
${SPOND_INVITE_URL}

Important: your team placement is temporary and may change until September 19, when rosters are finalized for the season. You'll be notified in Spond of any changes before then.${paymentReminder}

See you on the ice!
MIHL Admin`;

  const html = `
    <p>Hi ${firstName},</p>
    <p>You've been approved to play in the <strong>Menshes Ice Hockey League 2026-27 season</strong>.</p>
    <p>Join our Spond group here to see your team, schedule, and roster:</p>
    <p><a href="${SPOND_INVITE_URL}">${SPOND_INVITE_URL}</a></p>
    <p><strong>Important:</strong> your team placement is temporary and may change until <strong>September 19</strong>, when rosters are finalized for the season. You'll be notified in Spond of any changes before then.</p>
    ${paymentReminderHtml}
    <p>See you on the ice!<br/>MIHL Admin</p>
  `;

  await send(toEmail, subject, html, text);
}

export async function sendRegistrationReceivedEmail(
  toEmail: string,
  firstName: string,
  paymentPlan: "full" | "split"
) {
  const subject = "We've got your MIHL registration — pending approval";
  const paymentLine =
    paymentPlan === "split"
      ? "You selected the split payment plan: $450 due by September 11th, and $425 due by December 19th (total $875)."
      : "You selected full payment: $850, due by September 11th.";

  const text = `Hi ${firstName},

Thanks for registering for the Menshes Ice Hockey League 2026-27 season! Your registration is now pending review by league admin.

Once you're approved, you'll receive another email with an invite to join our Spond group, where you'll see your team, schedule, and roster.

${paymentLine} Payment by e-transfer to payments@mihl.ca.

MIHL Admin`;

  const html = `
    <p>Hi ${firstName},</p>
    <p>Thanks for registering for the <strong>Menshes Ice Hockey League 2026-27 season</strong>! Your registration is now pending review by league admin.</p>
    <p>Once you're approved, you'll receive another email with an invite to join our Spond group, where you'll see your team, schedule, and roster.</p>
    <p><strong>${paymentLine}</strong> Payment by e-transfer to payments@mihl.ca.</p>
    <p>MIHL Admin</p>
  `;

  await send(toEmail, subject, html, text);
}

export async function sendWaitlistEmail(toEmail: string, firstName: string) {
  const subject = "You've been added to the MIHL waitlist";
  const text = `Hi ${firstName},

The league is currently full. You've been added to the waitlist and will be notified by email as soon as a spot opens up.

Thanks for your patience,
MIHL Admin`;

  const html = `
    <p>Hi ${firstName},</p>
    <p>The league is currently full. You've been added to the waitlist and will be notified by email as soon as a spot opens up.</p>
    <p>Thanks for your patience,<br/>MIHL Admin</p>
  `;

  await send(toEmail, subject, html, text);
}

export async function sendStaffApprovalEmail(
  toEmail: string,
  firstName: string,
  role: "referee" | "scorekeeper"
) {
  const subject = `You're approved as a ${role} — MIHL`;
  const text = `Hi ${firstName},

You've been approved as a ${role} for the Menshes Ice Hockey League. Log in to the portal to view and claim open game slots for the season.

MIHL Admin`;
  const html = `<p>Hi ${firstName},</p><p>You've been approved as a <strong>${role}</strong> for the Menshes Ice Hockey League. Log in to the portal to view and claim open game slots for the season.</p><p>MIHL Admin</p>`;

  await send(toEmail, subject, html, text);
}

export async function sendSetPasswordEmail(
  toEmail: string,
  firstName: string,
  role: "referee" | "scorekeeper",
  token: string
) {
  const baseUrl = process.env.APP_URL ?? "https://mihl.ca";
  const link = `${baseUrl}/set-password?token=${token}`;
  const subject = `You're approved as a ${role} — set up your MIHL account`;
  const text = `Hi ${firstName},

You've been approved as a ${role} for the Menshes Ice Hockey League! We've created your portal account -- just set a password to finish setting it up:

${link}

Once that's done, you'll be able to log in and claim open game slots for the season.

MIHL Admin`;
  const html = `
    <p>Hi ${firstName},</p>
    <p>You've been approved as a <strong>${role}</strong> for the Menshes Ice Hockey League! We've created your portal account &mdash; just set a password to finish setting it up:</p>
    <p><a href="${link}">${link}</a></p>
    <p>Once that's done, you'll be able to log in and claim open game slots for the season.</p>
    <p>MIHL Admin</p>
  `;

  await send(toEmail, subject, html, text);
}

export async function sendPasswordResetEmail(
  toEmail: string,
  firstName: string,
  token: string
) {
  const baseUrl = process.env.APP_URL ?? "https://mihl.ca";
  const link = `${baseUrl}/set-password?token=${token}`;
  const subject = "Reset your MIHL password";
  const text = `Hi ${firstName},

We received a request to reset your MIHL portal password. Click the link below to choose a new one:

${link}

This link expires in 1 hour. If you didn't request this, you can safely ignore this email -- your password won't change.

MIHL Admin`;
  const html = `
    <p>Hi ${firstName},</p>
    <p>We received a request to reset your MIHL portal password. Click the link below to choose a new one:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email &mdash; your password won't change.</p>
    <p>MIHL Admin</p>
  `;

  await send(toEmail, subject, html, text);
}
