const admin = require('../app');

class FCM {
    async sendMessage(title, body, registrationToken) {
        console.log('Sending FCM message:', title, body, registrationToken);

        if (!title || !body || !registrationToken) {
            throw new Error('Missing required parameters');
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: registrationToken,
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('FCM message sent successfully');
            return response;
        } catch (error) {
            console.error('Error sending FCM message:', error);
            throw error;
        }
    }
}

module.exports = FCM;
