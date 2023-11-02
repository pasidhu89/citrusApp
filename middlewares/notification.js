const admin = require('../app');

class FCM {
    async sendMessage(title, body, registrationToken) {
        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: registrationToken,
        };

        try {
            const response = await admin.messaging().send(message);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FCM;
