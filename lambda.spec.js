const index = require('./index');
const testingObjects = require('./testingObjects')

test('It should create a new item', async () => {
    await index.handler(testingObjects.createItemEvent, {}, function (err, result) {
        expect(result.body).toBe('Item created');
    });
});

test('It should get an item', async () => {
    await index.handler(testingObjects.getItemEvent, {}, function (err, result) {
        const itemResult = JSON.parse(result.body)
        expect(itemResult.Item).toMatchObject(testingObjects.getItemEvent.queryStringParameters)
    });
});

test('It should update an item', async () => {
    await index.handler(testingObjects.updateItemEvent, {}, function (err, result) {
        expect(result.body).toBe('Item update');
    });
});

test('It should download an excel file', async () => {
    await index.handler(testingObjects.downloadExcelEvent, {}, function (err, result) {
        expect(result.headers['Content-Type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        expect(result.isBase64Encoded).toBe(true);
    });
});

test('It should download a PDF file', async () => {
    await index.handler(testingObjects.downloadPDFEvent, {}, function (err, result) {
        expect(result.headers['Content-Type']).toBe('application/pdf');
        expect(result.isBase64Encoded).toBe(true);
    });
});

test('It should delete an item', async () => {
    await index.handler(testingObjects.deleteItemEvent, {}, function (err, result) {
        expect(result.body).toBe('Item deleted');
    });
});
