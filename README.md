# Gridsome Dgraph
This is a simple gridsome skeleton that includes  
[idb](https://www.npmjs.com/package/idb) for offline first experiments  
and [dgraph-js-http](https://github.com/dgraph-io/dgraph-js-http)

### Configuration
You need to point dgraph at your alpha endpoint by adapting the [.env file](https://gridsome.org/docs/environment-variables/)  
to include the GRIDSOME_DGRAPH_URL variable:
```
GRIDSOME_DGRAPH_URL=https://your.dgraph.endpoint
```
which is used here in dgraph.js:
```js
function newClientStub() {
    return new dgraph.DgraphClientStub(process.env.GRIDSOME_DGRAPH_URL)
}
```

### To run the project in dev mode (from the root of the project directory)
1. yarn
2. `gridsome develop` to start a local dev server at `http://localhost:8080`

> note: This project is adapted from the default starter for Gridsome that you get when you run `gridsome create new-project`.
