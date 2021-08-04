//Payload to test item creation
const createItemPayload = {
    name: "Tony Stark",
    alias: "IronMan",
    species: "Human",
    company: {
        name: "Marvel",
        team: "Avengers"
    }
}
// Payload to test get an item information
const getItemQueryString = {
    name: "Tony Stark",
    alias: "IronMan",
}

//Payload to test item update
const updateItemPayload = {
    name: "Tony Stark",
    alias: "IronMan",
    species: "Update",
    company: {
        name: "Update",
        team: "Update"
    }
}

//Payload to test delete an item
const deleteItemPayload = {
    name: "Tony Stark",
    alias: "IronMan",
}

//Payload to simulate a create item event
exports.createItemEvent = {
    httpMethod: 'POST',
    body: JSON.stringify(createItemPayload),
    resource: '/qrvey'
}

//Payload to simulate a get item event
exports.getItemEvent = {
    httpMethod: 'GET',
    queryStringParameters: getItemQueryString,
    resource: '/qrvey'
}

//Payload to simulate an update item event
exports.updateItemEvent = {
    httpMethod: 'PUT',
    body: JSON.stringify(updateItemPayload),
    resource: '/qrvey'
}

//Payload to simulate a delete item event
exports.deleteItemEvent = {
    httpMethod: 'DELETE',
    body: JSON.stringify(deleteItemPayload),
    resource: '/qrvey'
}

//Payload to simulate download excel event
exports.downloadExcelEvent = {
    httpMethod: 'GET',
    queryStringParameters: {
        type: 'excel'
    },
    resource: '/qrvey/download'
}

//Payload to simulate download pdf event
exports.downloadPDFEvent = {
    httpMethod: 'GET',
    queryStringParameters: {
        type: 'pdf'
    },
    resource: '/qrvey/download'
}
