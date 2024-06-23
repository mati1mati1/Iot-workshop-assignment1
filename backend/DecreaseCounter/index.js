const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const connectionString = process.env.AzureWebJobsStorage;
    const tableName = 'CounterTable';
    const partitionKey = '1';
    const rowKey = '1';

    try {
        console.log("connectionString: " + connectionString);

        // Create a TableClient object
        const tableClient = TableClient.fromConnectionString(connectionString, tableName);

        // Retrieve the entity
        let entity = await tableClient.getEntity(partitionKey, rowKey);
        
        // Custom replacer function to handle BigInt
        const replacer = (key, value) => {
            return typeof value === 'bigint' ? value.toString() : value;
        };

        context.log('Entity:', JSON.stringify(entity, replacer, 2)); // Pretty print the entity

        // Increment the counter value
        entity.counter = BigInt(entity.counter) - 1n;

        context.log('Updated Entity:', JSON.stringify(entity, replacer, 2));

        // Update the entity
        await tableClient.updateEntity(entity, "Merge");

        context.res = {
            status: 200,
            body: `Counter value decremented to: ${entity.counter}`
        };
    } catch (error) {
        context.log.error(`Error decrementing counter value: ${error.message}`);
        context.res = {
            status: 500,
            body: `Error decrementing counter value: ${error.message}`
        };
    }
};
