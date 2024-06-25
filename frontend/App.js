const { TableClient } = require("@azure/data-tables");
const signalR = require("@microsoft/signalr");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const connectionString = process.env.AzureWebJobsStorage;
    const tableName = 'counter';
    const partitionKey = '1';
    const rowKey = '1';

    // SignalR configuration
    const hubBaseUrl = process.env.AzureSignalRHubUrl; // Base URL of your SignalR service without https:// prefix

    try {
        context.log("Connection string: " + connectionString);
        context.log("SignalR Hub URL: " + hubBaseUrl);

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
        entity.counter = BigInt(entity.counter) + 1n;

        context.log('Updated Entity:', JSON.stringify(entity, replacer, 2));

        // Update the entity
        await tableClient.updateEntity(entity, "Merge");

        // Create a SignalR connection
        const hubUrl = `https://${hubBaseUrl}/client/?hub=counterHub`;
        context.log("Hub URL:", hubUrl);

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        // Start the connection
        await connection.start();

        // Broadcast a message to all clients
        await connection.invoke("SendMessage", "counterUpdated", entity.counter.toString());

        // Stop the connection
        await connection.stop();

        context.res = {
            status: 200,
            body: `Counter value incremented to: ${entity.counter}`
        };
    } catch (error) {
        context.log.error(`Error incrementing counter value: ${error.message}`);
        context.res = {
            status: 500,
            body: `Error incrementing counter value: ${error.message}`
        };
    }
};
