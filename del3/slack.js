const request = require('request');
const config = require('./config');

exports.sendSlackNotification = function(title, msg) {
    if (!config.slack.username) {
        throw new Error("Sett brukernavnet ditt i ./config.js 🤓")
    }
    if (process.env.AWS_SAM_LOCAL) {
        throw new Error("⛔️  Posting til slack lokalt fungerer ikke ⛔️. Prøv å deploy lambdaen din til skyen 🌤!");
    }

    const attachment = getAttachment(title, msg);
    const requestOptions = {
        uri: process.env.SLACK_WEBHOOK,
        method: 'POST',
        json: {
          'username': config.username,
          'channel': config.channel,
          'attachments' : [attachment]
        }
      };
      return request(requestOptions);
};

function getAttachment(title, value) {
    const epochTime = new Date().getTime() / 1000;
    return {
      fields:  [{ 'title' : title, 'value': value}],
      ts: epochTime
    };
  }