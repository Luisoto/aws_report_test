const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
const tableName = process.env.DYNAMODB_TABLE;

//Function to add item to the Dynamo table
exports.createItem = function (body) {
    const params = {
        TableName: tableName,
        Item: body
    }
    return ddb.put(params).promise();

}

//Function to get an item to the Dynamo table
exports.getItem = function(queryStringParameters) {
    const params = {
        TableName: tableName,
        Key: queryStringParameters
    }
    return ddb.get(params).promise();
}

//Function to update an item to the Dynamo Table
exports.updateItem = function (body) {

    let updateExpression = 'set'
    let expressionAttributeValues = {}
    const keys = Object.keys(body);
    keys.forEach(key => {
        if (key !== 'name' && key !== 'alias') {
            updateExpression += ` ${key} = :${key},`
            expressionAttributeValues[`:${key}`] = body[key]
        }
    });

    updateExpression = updateExpression.substring(0, updateExpression.length - 1);

    const params = {
        TableName: tableName,
        Key:{
            "name": body.name,
            "alias": body.alias
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };
    return ddb.update(params).promise()
}

//Function to delete an item to the Dynamo Table
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

//Function to get all items from Dynamo db table to generate an excel or PDF file
exports.scanTable = function() {
    const params = {
        TableName: tableName
    }
    return ddb.scan(params).promise();
}