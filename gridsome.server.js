// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    const { init, queryData } = require('./src/data/dgraph')
    const everyone = (await queryData()).everyone
    if(everyone && everyone.length===0){
      console.log('No people in the DB running init...')
      init().then(async () => {
        const afterInit = await queryData()
        console.log("\nInit is DONE! DB now has people:", afterInit.everyone.length);
      }).catch((e) => {
        console.log("Init ERROR: ", e);
      });
    } else {
      console.log("DB already has people:", everyone.length);
    }

    
    // One can use the Data Store API here: https://gridsome.org/docs/data-store-api/
    // const posts = addCollection({
    //   typeName: 'BlogPost'
    // })
  
    // posts.addNode({
    //   title: 'My first blog post',
    //   date: '2018-11-02',
    //   customField: 'customizatorial'
    // })
    // posts.addNode({
    //   title: 'My second blog post',
    //   date: '2019-11-02',
    //   customField: 'well it took a whole year for the second post... hmm.'
    // })
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })

  api.configureServer(async app => {
    // app.get('/my-endpoint', (req, res) => {
    //   res.send('Hello, world!')
    // })
   
  })

 
  // api.configureWebpack({
  //  https://gridsome.org/docs/config/#configurewebpack
  //    rather use gridsome.config.js
  // })

}
