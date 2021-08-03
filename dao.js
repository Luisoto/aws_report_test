const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
const tableName = process.env.DYNAMODB_TABLE;

exports.createItem = function (body) {
    const params = {
        TableName: tableName,
        Item: body
    }
    return ddb.put(params).promise();

}

exports.getItem = function(queryStringParameters) {
    const params = {
        TableName: tableName,
        Key: queryStringParameters
    }
    return ddb.get(params).promise();
}

exports.updateItem = function (body) {
    const params = {
        TableName: tableName,
        Key:{
            "year": year,
            "title": title
        },
        ConditionExpression:"info.rating <= :val",
        ExpressionAttributeValues: {
            ":val": 5.0
        }
    };
    return ddb.update(params).promise()
}

exports.deleteItem = function (body) {
    const params = {
        TableName: tableName,
        Key: {
            name: body.name,
            alias: body.alias
        }
    }
    console.log(params)
    return ddb.delete(params).promise()
}

exports.scanTable = function() {
    const params = {
        TableName: tableName
    }
    return ddb.scan(params).promise();
}