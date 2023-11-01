const https = require('https');

async function handler(event) {
    const rawMessage = event.Records[0].Sns.Message;
    const parsedMessage = parseMessage(rawMessage);

    if (!parsedMessage) {
        console.error('Failed to parse the message.');
        return;
    }

    const { status, url } = parsedMessage;
    const emoji = determineEmoji(status);

    const postData = createSlackMessagePayload(status, url, emoji);
    await sendToSlack(postData);
}
exports.handler = handler;

function parseMessage(rawMessage) {
    const statusMatch = rawMessage.match(/Your build status is (\w+)./);
    const urlMatch = rawMessage.match(/Go to (https:\/\/console\.aws\.amazon\.com\/.+?) to view details/);
    const environmentMatch = rawMessage.match(/Amplify Environment: (\w+)/);

    if (statusMatch && urlMatch && environmentMatch) {
        return {
            status: statusMatch[1],
            url: urlMatch[1],
            environment: environmentMatch[1]
        };
    }

    return null;
}

function determineEmoji(status) {
    switch(status) {
        case 'STARTED': return ':arrow_forward:';
        case 'SUCCEED': return ':white_check_mark:';
        case 'FAILED': return ':x:';
        default: return ':alert:';
    }
}

function createSlackMessagePayload(status, url, environment, emoji) {
    return JSON.stringify({
        attachments: [{
            title: `${emoji} AWS Amplify Notification`,
            text: `*Project:* ${process.env.PROJECT_NAME}\n*Environment:* _${environment}_\n*Status:* _${status}_\n\n<${url}|(View Details)>`
        }]
    });
}

async function sendToSlack(postData) {
    const options = {
        hostname: 'hooks.slack.com',
        path: process.env.SLACK_WEBHOOK_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    let responseBody = await new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        });

        req.on('error', e => reject(e));

        req.write(postData);
        req.end();
    });

    if (responseBody.statusCode !== 200) {
        throw new Error(`Failed to send notification: ${responseBody.body}`);
    }
    console.log('sent!');
}