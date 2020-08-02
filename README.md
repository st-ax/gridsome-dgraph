# Gridsome Dgraph
 This is a simple skeleton app that initializes a Dgraph DB with mockdata, <br>
      Renders the data from Dgraph into an expandable JSON tree, <br>
      and offers editing via vue-editable-grid.

Including:  
[idb](https://www.npmjs.com/package/idb) for offline-first experiments (very early WIP)  
[dgraph-js-http](https://github.com/dgraph-io/dgraph-js-http)  
[vue-editable-grid](https://github.com/eledwinn/vue-editable-grid)


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
