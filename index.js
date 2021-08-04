const dotenv = require('dotenv');
dotenv.config();
const utils = require('./utils');
const dao = require('./dao');

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
const fs = require('fs');
exports.handler = async (event, context, callback) => {

    let statusCode;
    let body;

    switch (event.httpMethod) {
        case 'POST':
            //Call function to create a new item with the received body
            await dao.createItem(JSON.parse(event.body)).then((data) => {
                callback(null, {
                    statusCode: 200,
                    body: 'Item created',
                    headers: {
                        'Access-Control-Allow-Origin' : '*'
                    }
                });
            }).catch((err) => {
                callback(null, {
                    statusCode: 500,
                    body: JSON.stringify(err),
                    headers: {
                        'Access-Control-Allow-Origin' : '*'
                    }
                });
            });
            break;
        case 'PUT':
            await dao.updateItem(JSON.parse(event.body)).then(async (data) => {
                console.log(data);
                callback(null, {
                    statusCode: 200,
                    body: 'Item update',
                    headers: {
                        'Access-Control-Allow-Origin' : '*'
                    }
                });
            }).catch((err) => {
                callback(null, {
                    statusCode: 500,
                    body: JSON.stringify(err),
                    headers: {
                        'Access-Control-Allow-Origin' : '*'
                    }
                });
            });
            break;
        case 'GET':

            if (event.resource === '/qrvey/download') {
                //For this case we need to generate the file,
                // first we call the scan function to get all the items on the dynamodb table
                await dao.scanTable().then(async (data) => {
                    if (event.queryStringParameters.type === 'pdf') {
                        //Get data in a format makepdf library can read, and generate the table
                        const bodyDocDefinition = utils.itemsToDocDefinition(data.Items);
                        const dd = {
                            content: [
                                {
                                    table: {
                                        body: bodyDocDefinition
                                    }
                                }
                            ]
                        }
                        let pdfDoc = printer.createPdfKitDocument(dd);

                        const buffer = await new Promise((resolve, reject) => {
                            let chunks = [];
                            pdfDoc.on('data', chunk => chunks.push(chunk));
                            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
                            pdfDoc.end();

                        });
                        //Return base64 string for the pdf document
                        const response = {
                            headers: {
                                'Content-Type': 'application/pdf',
                            },
                            body: buffer.toString('base64'),
                            isBase64Encoded : true,
                            statusCode: 200
                        }
                        callback(null, response)
                    }
                    else {
                        //Call function to convert items to an excel table.
                        let wb = utils.itemsToExcel(data.Items);
                        //Return base64 string for the excel document
                        await wb.writeToBuffer().then(buffer => {
                            const response = {
                                headers: {
                                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                },
                                body: buffer.toString('base64'),
                                isBase64Encoded : true,
                                statusCode: 200
                            }
                            callback(null, response)
                        });
                    }
                });
            }
            else {
                // Call function to get item information
                await dao.getItem(event.queryStringParameters).then((data) => {
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify(data),
                        headers: {
                            'Access-Control-Allow-Origin' : '*'
                        }
                    });
                }).catch((err) => {
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify(err),
                        headers: {
                            'Access-Control-Allow-Origin' : '*'
                        }
                    });
                });
            }
            break;
        case 'DELETE':
            // Call function to delete an item
            await dao.deleteItem(JSON.parse(event.body)).then((data) => {
                callback(null, {
                    statusCode: 200,
                    body: 'Item deleted',
                    headers: {
                        'Access-Control-Allow-Origin' : '*'
                    }
                });
            }).catch((err) => {
                callback(null, {
                    statusCode: 500,
                    body: JSON.stringify(err),
                    headers: {
                        'Access-Control-Allow-Origin' : '*'
                    }
                });
            });
            break;
        default:
            callback(null, {
                statusCode: 404,
                body: JSON.stringify('httpMethod not supported'),
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            });
    }
};
