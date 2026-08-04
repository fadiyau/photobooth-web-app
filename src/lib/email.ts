import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

console.log(
  "BREVO API KEY:",
  process.env.BREVO_API_KEY?.slice(0, 12)
);

// =========================
// WELCOME EMAIL
// =========================
export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Photobooth",
        email: process.env.BREVO_SENDER_EMAIL!,
      },
      to: [
        {
          email,
          name,
        },
      ],
      subject: "🎉 Selamat Datang di Photobooth!",
      htmlContent: `
        <div style="font-family:Arial,sans-serif">
          <h2>Halo ${name}! 👋</h2>

          <p>
            Terima kasih sudah mendaftar di
            <strong>Photobooth</strong>.
          </p>

          <p>
            Selamat berkreasi dan semoga pengalamanmu
            menyenangkan 📸
          </p>

          <br>

          <p>
            Salam,<br>
            <strong>Tim Photobooth</strong>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("WELCOME EMAIL ERROR:", error);
    throw error;
  }
}

// =========================
// EMAIL VERIFICATION OTP
// =========================
export async function sendOtpVerificationEmail(
  email: string,
  name: string,
  otp: string
) {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Photobooth",
        email: process.env.BREVO_SENDER_EMAIL!,
      },
      to: [
        {
          email,
          name,
        },
      ],
      subject: "Kode Verifikasi Email Photobooth",
      htmlContent: `
      <div style="font-family:Arial,sans-serif">

        <h2>Halo ${name}! 👋</h2>

        <p>
          Terima kasih telah mendaftar di
          <strong>Photobooth</strong>.
        </p>

        <p>
          Gunakan kode OTP berikut untuk
          memverifikasi email kamu:
        </p>

        <div
          style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            margin:30px 0;
            color:#2563eb;
          "
        >
          ${otp}
        </div>

        <p>
          Kode ini hanya berlaku selama
          <strong>5 menit</strong>.
        </p>

        <p>
          Jika kamu tidak merasa membuat akun,
          abaikan email ini.
        </p>

        <br>

        <p>
          Salam,<br>
          <strong>Tim Photobooth</strong>
        </p>

      </div>
      `,
    });
  } catch (error) {
    console.error("OTP EMAIL ERROR:", error);
    throw error;
  }
}

export async function sendResetPasswordEmail(
  email: string,
  name: string,
  token: string
) {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Photobooth",
        email: process.env.BREVO_SENDER_EMAIL!,
      },
      to: [
        {
          email,
          name,
        },
      ],
      subject: "Reset Password Photobooth",
      htmlContent: `
      <div style="font-family:Arial,sans-serif">

        <h2>Halo ${name} 👋</h2>

        <p>
          Kami menerima permintaan untuk mereset password akun Photobooth kamu.
        </p>

        <p>
          Klik tombol berikut untuk membuat password baru:
        </p>

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            margin-top:20px;
            padding:12px 24px;
            background:#2563eb;
            color:white;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:30px">
          Link ini hanya berlaku selama
          <strong>15 menit</strong>.
        </p>

        <p>
          Jika kamu tidak meminta reset password,
          abaikan email ini.
        </p>

      </div>
      `,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}