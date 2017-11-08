'use strict';

console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {
            const body = JSON.parse(data.Body.toString());
            const trips = body.trips;
            const nrOfTripsFromVippetangen = trips.filter(elem => elem.start_station_id === 249).length;
            console.log(`Total number of trips from Vippetangen: ${nrOfTripsFromVippetangen}`);
            const mapOfNrOfTripsToStop = trips.reduce((map, trip) => {
                if (trip.start_station_id === 249) {
                    map[trip.end_station_id] = (map[trip.end_station_id] || 0) + 1;
                }
                return map;
            }, {});
            const mostPopularStop = Object.keys(mapOfNrOfTripsToStop).reduce((mostPopular, stopId) => {
                const tripsToStop = mapOfNrOfTripsToStop[stopId];
                return mostPopular.trips >= tripsToStop ? mostPopular : {id: stopId, trips: tripsToStop};
            }, {id: -1, trips: 0})
            console.log(`Most popular trip: ${JSON.stringify(mostPopularStop)}`);
            callback(null, 'Done');
        }
    });
};