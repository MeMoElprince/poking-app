const { Resend } = require('resend');
const pug = require('pug');
const htmlToText = require('html-to-text');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.url = url;
        // Resend requires `from` to be onboarding@resend.dev (test) or a verified domain.
        this.from = process.env.RESEND_FROM || 'PokingApp <onboarding@resend.dev>';
    }

    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            url: this.url,
            subject
        });

        // 2) Send via Resend HTTP API (works on hosts that block SMTP)
        const { error } = await resend.emails.send({
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        });

        // Resend returns the error instead of throwing — surface it so callers catch it
        if (error)
            throw new Error(error.message || 'Failed to send email');
    }

    async sendVerification() {
        await this.send('verification', 'Verify your email address');
    }
}
