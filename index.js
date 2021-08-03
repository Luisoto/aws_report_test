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
            break;
        case 'GET':
            if (event.resource === '/qrvey/download') {
                //Generate file
                await dao.scanTable().then(async (data) => {
                    if (event.queryStringParameters.type === 'pdf') {
                        //Get data for create table
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
                        //const pdfDoc = printer.createPdfKitDocument(dd);
                        //pdfDoc.pipe(fs.createWriteStream('document.pdf'));
                        //pdfDoc.end();

                        var pdfDoc = printer.createPdfKitDocument(dd);

                        const buffer = await new Promise((resolve, reject) => {
                            let chunks = [];
                            pdfDoc.on('data', chunk => chunks.push(chunk));
                            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
                            pdfDoc.end();

                        });
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
                        let wb = utils.itemsToExcel(data.Items);
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
            statusCode = 404;
            body = JSON.stringify('httpMethod not supported');
    }
};
