import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await resend.emails.send({
        from: "Memoza <onboarding@resend.dev>",
        to: [email],
        subject: "Reset your memoza password",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Reset your Memoza password</h2>

                <p>
                    We received a request to reset your Memoza password.
                </p>

                <p>
                    Click the button below to create a new password.
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#000;
                        color:#fff;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>

                <p style="margin-top:20px;">
                    This link will expire in 15 minutes.
                </p>

                <p>
                    If you didn't request a password reset,
                    you can safely ignore this email.
                </p>
            </div>
        `
    })
}