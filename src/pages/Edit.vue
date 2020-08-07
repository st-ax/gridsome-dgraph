<template>
  <Layout>
    <h1>JSON editor</h1>
     <tree-view
      :data="dataset"
      :options="{
        modifiable: false,
        maxDepth: 2}"
      @change-data="treeUpdated"
    />
    <div style="height: 500px;"> <!-- The parent height is required -->
      <vue-editable-grid
        style="height: 500px;"
        class="grid"
        ref="grid"
        :column-defs="columnDefs"
        :row-data="dataset || []"
        row-data-key='uid'
        @cell-updated="cellUpdated"
        @row-selected="rowSelected"
        @link-clicked="linkClicked"
      />
    </div>
  </Layout>
</template>

<script>
import { mutateData } from '../data/dgraph'
import { getEveryone, subscribeEveryone, offDB } from '../data/sync'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'

const columnDefs = [
  { field: "uid", headerName: 'uid', type:'text',sortable: true, filter: true, editable: false },
  { field: "name@en", headerName: 'name@en',type:'text',sortable: true, filter: true, editable: true },
  { field: "friendships", headerName: 'friendships',type:'text',sortable: true, filter: true, editable: false },
]

export default {
  
  async created() {
    this.dataset = await getEveryone()
    subscribeEveryone(this, 'dataset') // a rather funky attempt to allow functions in the sync module to directly update Vue data model and trigger rerender - a prep for "subscriptions"
  },
  data() {
    return {
      // offDB,
      dataset: [],
      columnDefs
    }
  },
  methods: {
    treeUpdated: async function treeUpdated(newData) {
      console.log('treeUpdated:', newData)
      const changeSet= updatedDiff(this.dataset,newData)
      console.log('changed:', changeSet)

      const updatable = ["name"]
      let mu = ''
      for(let eachKey in changeSet){
        let eachuid=this.dataset[eachKey].uid
        for(let eachFieldName in changeSet[eachKey]){
          if(updatable.includes(eachFieldName)){
            let newValue=changeSet[eachKey][eachFieldName]
            mu += `
              <${eachuid}> <${eachFieldName}@en> "${newValue}" .
              <${eachuid}> <modified> "${(new Date()).toISOString()}" .
            `
            this.dataset[eachKey][eachFieldName] = newValue
          } else {
            console.log('TODO revert')
          }

        }
      }
      console.log('Mutation:', mu)
      if(mu.length)
        await mutateData({setNquads:mu}) // will commitNow unless overridden here
      
    },
    cellUpdated: async (newData) => {
      const modDate=new Date()
      newData.row.modified=modDate.toISOString()
      console.log('cellUpdated:', newData)

      console.log('offDB',offDB);
      
      // Dexie
      const dexVal = (await offDB.people.get(newData.row.uid)) || newData;
      console.log('current dexie record:', dexVal);

      
      // TODO create revisions in single rows (less micro managing here)
      // TODO consider data model for storing revisions in dgraph ( )
      if(newData.column.field=='name@en'){
        newData.row.name=newData.value
        const modTS=modDate.getTime()
        let st=performance.now()
        const revs = await offDB.revisions.get(`${newData.row.uid}.${newData.column.field}`)
        const msForDirectGet = performance.now() - st;
        st = performance.now()
        const revsByQuery = await offDB.revisions.where({uid:newData.row.uid,prop:newData.column.field}).first()
        const msForQuery= performance.now() - st;
        console.log(`direct: ${msForDirectGet} VS query: ${msForQuery}`, msForQuery-msForDirectGet)
        const revMap = (revs && revs.revMap) ? revs.revMap : {};
        revMap[modTS] = newData.value;
        offDB.revisions.put({
          revid:`${newData.row.uid}.${newData.column.field}`,
          uid:newData.row.uid,
          prop:newData.column.field,
          revMap})
      }

      await offDB.people.put(newData.row,newData.row.uid);
      
      const mu = `
        <${newData.row.uid}> <${newData.column.field}> "${newData.value}" .
        <${newData.row.uid}> <modified> "${newData.row.modified}" .
      `
      console.log('mutation:', mu)
      await mutateData({setNquads:mu})
      // await tx.done;
      
    },
    rowSelected: ({colData,colIndex,rowData,rowIndex}) => {
      colData && console.log(colData.field,' selected:',rowData[colData.field])
    },
    linkClicked: (args) => {
      console.log(args)
    },
  },

  metaInfo: {
    title: 'JSON editor'
  }
}

//////
// stashing this here as a n example but i don't like the gridsome internal graphql actually
//////
// <ul>
//   {{$page.posts}} 
//   <li v-for="eachPost in $page.posts.edges" :key="eachPost.post.date">{{eachPost.post.title}}</li>
// </ul>
// <page-query>
// query {
//   posts: allBlogPost {
//     edges {
//       post: node {
//         date
//         title
//         customField
//       }
//     }
//   }
// }
// </page-query>

</script>
