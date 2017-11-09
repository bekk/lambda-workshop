'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event));

    // TODO: Get S3 bucket name and key of uploaded file from event object
    const bucket;
    const key;
    const params = {
        Bucket: bucket,
        Key: key
    };
    console.log(`Getting object ${key} from bucket ${bucket}`);

    s3.getObject(params, (err, data) => {
        if (error) {
            console.log(err);
            callback(error);
        } else {
            const body = JSON.parse(data.Body.toString());

            // TODO: Find the most popular trip from Vippetangen

            // TODO: Post result to slack

            callback();
        }
    });
};