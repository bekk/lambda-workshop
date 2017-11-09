'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const VIPPETANGEN_EAST_ID = 249;
const VIPPETANGEN_WEST_ID = 278;

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event));

    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const params = {
        Bucket: bucket,
        Key: key
    };
    console.log(`Getting object ${key} from bucket ${bucket}.`);
    
    s3.getObject(params, (error, data) => {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            const body = JSON.parse(data.Body.toString());
            const trips = body.trips;
            const mostPopularStation= findMostPopularEndStation(trips);
            console.log(`The most popular trip is: ${JSON.stringify(mostPopularStation)}`);
            //TODO: post result to slack
            callback();
        }
    });
};

function findMostPopularEndStation(trips) {
    const stations = trips.reduce((map, trip) => {
        if (tripStartedFromVippetangen(trip)) {
            const id = trip.end_station_id;
            map[id] = (map[id] || 0) + 1;
            map.mostPopular = map[id] > map.mostPopular.nrOfTrips ? {nrOfTrips: map[id], id} : map.mostPopular;
        }
        return map;
    }, {mostPopular: {nrOfTrips: 0}});
    return stations.mostPopular;
}

function tripStartedFromVippetangen({start_station_id}) {
    return start_station_id === VIPPETANGEN_EAST_ID || start_station_id === VIPPETANGEN_WEST_ID;
}