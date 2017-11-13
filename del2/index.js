'use strict';

const incompleteResp = {statusCode: 500, body: 'Incomplete'};
const completeResp = {statusCode: 200, body: 'OK'};

exports.handler = (event, context, callback) => {
    console.log('Logging works');

    const userAgentString = ''; // TODO: Figure out what this value should be.
    const response = event.headers['User-Agent'] === userAgentString ? completeResp : incompleteResp;
    callback(null, response);

}
