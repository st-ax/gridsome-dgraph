# Gridsome Dgraph
This is a simple gridsome skeleton that includes  
[idb](https://www.npmjs.com/package/idb) for offline first experiments  
and [dgraph-js-http](https://github.com/dgraph-io/dgraph-js-http)

### Configuration
You need to point dgraph at your alpha endpoint:
```js
function newClientStub() {
    return new dgraph.DgraphClientStub(`https://${your.dgraphhttps.endpoint}`)
}
```

### To run the project in dev mode
1. yarn
2. `gridsome develop` to start a local dev server at `http://localhost:8080`

> note: This project is adapted from the default starter for Gridsome that you get when you run `gridsome create new-project`.
