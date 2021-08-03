const createItemPayload = {
    name: "Tony Stark",
    alias: "IronMan",
    species: "Human",
    company: {
        name: "Marvel",
        team: "Avengers"
    }
}

const getItemQueryString = {
    name: "Tony Stark",
    alias: "IronMan",
}

const deleteItemPayload = {
    name: "Tony Stark",
    alias: "IronMan",
}

exports.createItemEvent = {
    httpMethod: 'POST',
    body: JSON.stringify(createItemPayload),
    resource: '/qrvey'
}

exports.getItemEvent = {
    httpMethod: 'GET',
    queryStringParameters: getItemQueryString,
    resource: '/qrvey'
}

exports.deleteItemEvent = {
    httpMethod: 'DELETE',
    body: JSON.stringify(deleteItemPayload),
    resource: '/qrvey'
}

exports.downloadExcelEvent = {
    httpMethod: 'GET',
    queryStringParameters: {
        type: 'excel'
    },
    resource: '/qrvey/download'
}

exports.downloadPDFEvent = {
    httpMethod: 'GET',
    queryStringParameters: {
        type: 'pdf'
    },
    resource: '/qrvey/download'
}