//https://github.com/dgraph-io/dgraph-js-http/blob/master/examples/simple/index-async-await.js
const dgraph = require("dgraph-js-http");

// Create a client stub.
function newClientStub() {
    return new dgraph.DgraphClientStub("https://dghttp.tam.ma");
}

// Create a client.
function newClient(clientStub) {
    return new dgraph.DgraphClient(clientStub);
}

// Drop All - discard all data and start from a clean slate.
async function dropAll(dgraphClient) {
    await dgraphClient.alter({ dropAll: true });
}

// Set schema.
async function setSchema(dgraphClient) {
    const schema = `
        name: string @index(exact) .
        age: int .
        married: bool .
        loc: geo .
        dob: datetime .
    `;
    await dgraphClient.alter({ schema: schema });
}

// Create data using JSON.
async function createData(dgraphClient) {
    // Create a new transaction.
    const txn = dgraphClient.newTxn();
    try {
        // Create data.
        const p = {
            name: "Alice",
            age: 26,
            married: true,
            loc: {
                type: "Point",
                coordinates: [1.1, 2],
            },
            dob: new Date(1980, 1, 1, 23, 0, 0, 0),
            friend: [
                {
                    name: "Bob",
                    age: 24,
                },
                {
                    name: "Charlie",
                    age: 29,
                }
            ],
            school: [
                {
                    name: "Crown Public School",
                }
            ]
        };

        // Run mutation.
        const assigned = await txn.mutate({ setJson: p });

        // Commit transaction.
        await txn.commit();

        // Get uid of the outermost object (person named "Alice").
        // Assigned#getUidsMap() returns a map from blank node names to uids.
        // For a json mutation, blank node names "blank-0", "blank-1", ... are used
        // for all the created nodes.
        console.log(`Created person named "Alice" with uid = ${assigned.data.uids["blank-0"]}\n`);

        console.log("All created nodes (map from blank node names to uids):");
        Object.keys(assigned.data.uids).forEach((key) => console.log(`${key} => ${assigned.data.uids[key]}`));
        console.log();
    } finally {
        // Clean up. Calling this after txn.commit() is a no-op
        // and hence safe.
        await txn.discard();
    }
}

// Query for data.
async function queryData(
        query = `query all($a: string) {
            all(func: eq(name, $a)) {
                uid
                name
                age
                married
                loc
                dob
                friend {
                    name
                    age
                }
                school {
                    name
                }
            }
        }`,
        vars = { $a: "Alice" },
        dgraphClient = newClient(newClientStub()),
        trx = dgraphClient.newTxn()
    ) {
    
    const res = await trx.queryWithVars(query, vars);
    const dataset = res.data;

    // Print results.
    console.log(`Number of records in dataset: ${dataset.all.length}`);
    dataset.all.forEach((record) => console.log(record));
}

async function init() {
    const dgraphClientStub = newClientStub();
    const dgraphClient = newClient(dgraphClientStub);
    await dropAll(dgraphClient);
    await setSchema(dgraphClient);
    await createData(dgraphClient);
    await queryData(dgraphClient);
}

module.exports = { init, queryData }

