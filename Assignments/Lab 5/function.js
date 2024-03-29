console.log('Loading function');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
 
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
 
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const payload = {};
    if (event.tableName) {
        payload.TableName = event.tableName;
    }
    if (event.Item) {
        payload.Item = event.Item;
    }
    if (event.Key) {
        payload.Key = event.Key;
    }
    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(JSON.parse(event.body), done);
            break;
        case 'GET':
            dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
            break;
        case 'POST':
            dynamo.putItem(JSON.parse(event.body), done);
            break;
        case 'PUT':
            dynamo.updateItem(JSON.parse(event.body), done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
}