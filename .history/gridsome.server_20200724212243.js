// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
import { main } from 'server/dgraph'
module.exports = function (api) {
  api.loadSource(({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })

  api.configureServer(app => {
    // app.get('/my-endpoint', (req, res) => {
    //   res.send('Hello, world!')
    // })
    main().then(() => {
      console.log("\nDONE!");
    }).catch((e) => {
      console.log("ERROR: ", e);
    });
  })

}
