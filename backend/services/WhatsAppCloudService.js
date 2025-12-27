const https = require('https');

class WhatsAppCloudService {
    constructor() {
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        this.phoneNumberId = process.env.WHATSAPP_PHONE_ID;
        this.version = 'v21.0';
        this.baseUrl = `https://graph.facebook.com/${this.version}`;
    }

    /**
     * Sends a template message associated with the business account.
     * @param {string} to - The recipient's phone number (with country code, no +).
     * @param {string} templateName - The name of the approved template.
     * @param {string} languageCode - Language code (e.g., 'es', 'en_US').
     * @param {Array} components - Array of component objects (header, body parameters).
     */
    async sendTemplateMessage(to, templateName, languageCode = 'es', components = []) {
        if (!this.accessToken || !this.phoneNumberId) {
            throw new Error('Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_ID in environment variables.');
        }

        const payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                components: components
            }
        };

        return this._sendRequest(payload);
    }

    /**
     * Internal method to send HTTP requests to the Meta Graph API.
     * Uses native fetch (Node 18+) or https module as fallback if needed, 
     * but assuming Node environment in this project.
     */
    async _sendRequest(payload) {
        const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`WhatsApp API Error: ${JSON.stringify(data)}`);
            }

            return data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }

    /**
     * Future method for sending WhatsApp Flows.
     * @param {string} to 
     * @param {string} flowId 
     * @param {object} flowData 
     */
    async sendFlow(to, flowId, flowData) {
        // TODO: Implement Flow sending logic
        // https://developers.facebook.com/docs/whatsapp/flows/
        console.log('Flows implementation pending.');
    }
}

module.exports = new WhatsAppCloudService();
