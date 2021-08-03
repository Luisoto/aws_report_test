const index = require('./index')

const resultHandler = index.handler({
    httpMethod: 'GET',
    body: "{\"name\":\"Tony Stark\",\"alias\":\"IronMan\",\"species\":\"Human\",\"company\":{\"name\":\"Marvel\",\"team\":\"Avengers\"}}",
    //queryStringParameters: {name: 'Tony', alias: 'IronMan'}
    queryStringParameters: {type: 'pdf'},
    resource: '/qrvey/download'
}, {
    awsRequestId: "asdf1234"
}, (err, data) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log(data)
    }
})

console.log(resultHandler)