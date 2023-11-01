const https = require('https');

exports.handler = async (event) => {
    const message = event.Records[0].Sns.Message;

    const postData = JSON.stringify({
        attachments: [{
            title: `AWS Amplifyy Notification!`,
            text: message,
        }]
    });

    const options = {
        hostname: 'hooks.slack.com',
        path: '',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode === 200) {
                console.log('sent!');
                resolve();
            } else {
                res.on('data', (chunk) => {
                    reject(new Error(`Failed to send notification: ${chunk}`));
                });
            }
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
};
