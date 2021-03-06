//https://github.com/dgraph-io/dgraph-js-http/blob/master/examples/simple/index-async-await.js
const OfflineTxn = require("dgraph-offline-first").OfflineTxn
const dgraph = require("dgraph-js-http")
const { schema, initialDataSet, everyoneQuery } = require('./mockdata')
// Create a client stub.
function newClientStub() {
    return new dgraph.DgraphClientStub(process.env.GRIDSOME_DGRAPH_URL)
}

// Create a client.
function newClient(clientStub) {
    return new dgraph.DgraphClient(clientStub)
}

// Drop All - discard all data and start from a clean slate.
async function dropAll(dgraphClient) {
    await dgraphClient.alter({ dropAll: true })
}

// Set schema.
async function setSchema(dgraphClient) {
    await dgraphClient.alter({ schema: schema });
}

// Create data using JSON.
async function createData(dgraphClient) {
    // Create a new transaction.
    const txn = dgraphClient.newTxn();
    try {
        // Run mutation.  https://github.com/dgraph-io/dgraph-js-http/blob/master/src/clientStub.ts#L199
        const assigned = await txn.mutate({ setNquads: initialDataSet });

        // Commit transaction.
        await txn.commit();

        // Get uid of the outermost object (person named "Alice").
        // Assigned#getUidsMap() returns a map from blank node names to uids.
        // For a json mutation, blank node names "blank-0", "blank-1", ... are used
        // for all the created nodes.
        console.log(`Created people`,assigned.data);

        // console.log("All created nodes (map from blank node names to uids):");
        // Object.keys(assigned.data.uids).forEach((key) => console.log(`${key} => ${assigned.data.uids[key]}`));
        // console.log();
    } finally {
        // Clean up. Calling this after txn.commit() is a no-op
        // and hence safe.
        await txn.discard();
    }
}

// Query for data.
async function queryData(
        query = everyoneQuery,
        vars,
        dgraphClient = newClient(newClientStub()),
        trx = dgraphClient.newTxn()
    ) {
    
    const res = await trx.queryWithVars(query, vars)
    const dataset = res.data

    // Print results.
    if(dataset.everyone){
        console.log(`Number of records in dataset: ${dataset.everyone.length}`)
        // dataset.everyone.forEach((record) => console.log(record))
    } else {
        console.log(`Dataset: ${dataset}`)
    }
    return dataset
}


async function mutateData(
        query,
        dgraphClient = newClient(newClientStub()),
        trx = new OfflineTxn( dgraphClient )
    ) {
    if(query.commitNow !== false)  query.commitNow = true  // default to true if not explicitly set to false
    let dataset
    try {
        const res = await trx.mutate(query)
        dataset = res.data

        // Print results.
        console.log(`Mutation Dataset:`, dataset)
            
        if(query.commitNow === false)  await trx.commit() // TODO consider if there is a scenario for mutateDataNoCommit()
        
    } finally {
        // Clean up. Calling this after trx.commit() is a no-op
        // and hence safe.
        await trx.discard()
    }
    return dataset
}

async function init() {
    const dgraphClientStub = newClientStub();
    const dgraphClient = newClient(dgraphClientStub);
    await dropAll(dgraphClient);
    await setSchema(dgraphClient);
    await createData(dgraphClient);
    // await queryData(dgraphClient);
}

module.exports = { init, queryData, mutateData }

