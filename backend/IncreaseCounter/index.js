const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const connectionString = process.env.AzureWebJobsStorage;
  const tableName = 'counter';
  const partitionKey = '1';
  const rowKey = '1';

  try {
    // Create a TableClient object
    const tableClient = TableClient.fromConnectionString(connectionString, tableName);

    // Retrieve the entity
    let entity = await tableClient.getEntity(partitionKey, rowKey);

    // Increment the counter value
    entity.counter = BigInt(entity.counter) + 1n;

    // Update the entity
    await tableClient.updateEntity(entity, "Merge");

    // Send message to SignalR
    const message = `${entity.counter}`;
    context.bindings.signalIotHw2 = [{
      'target': 'newMessage',
      'arguments': [message]
    }];

    context.res = {
      status: 200,
      body: `${entity.counter}`
    };
  } catch (error) {
    context.log.error(`Error incrementing counter value: ${error.message}`);
    context.res = {
      status: 500,
      body: `Error incrementing counter value: ${error.message}`
    };
  }
};
