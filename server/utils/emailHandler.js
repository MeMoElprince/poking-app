const pug = require('pug');
const htmlToText = require('html-to-text');

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.name || 'there';
        this.url = url;
        this.appUrl = process.env.CLIENT_URL || 'https://poking-app.netlify.app';
    }

    async send(template, subject, data = {}) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            url: this.url,
            name: this.name,
            appUrl: this.appUrl,
            subject,
            ...data
        });

        // 2) Send via Brevo HTTP API (works on hosts that block SMTP, no domain needed)
        const res = await fetch(BREVO_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: {
                    email: process.env.BREVO_SENDER_EMAIL,
                    name: process.env.BREVO_SENDER_NAME || 'PokingApp'
                },
                to: [{ email: this.to }],
                subject,
                htmlContent: html,
                textContent: htmlToText.convert(html)
            }),
            signal: AbortSignal.timeout(15000)
        });

        // Brevo returns non-2xx on failure — surface it so callers catch it
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Brevo send failed (${res.status}): ${body}`);
        }
    }

    async sendVerification() {
        await this.send('verification', 'Verify your email address');
    }

    async sendMessageNotification(senderName) {
        await this.send(
            'messageNotification',
            `${senderName} sent you a message on Poking App`,
            { senderName }
        );
    }
}
