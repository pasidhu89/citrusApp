

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

        return admin.messaging().send(message);
    }
}

module.exports = FCM;
