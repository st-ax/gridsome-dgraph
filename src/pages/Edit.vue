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
        id="editMe"
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
import { getEveryone, subscribeEveryone, updateRecord } from '../data/sync'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'

const columnDefs = [
  { field: "uid", headerName: 'uid', type:'text',sortable: true, filter: true, editable: false },
  { field: "name@en", headerName: 'name@en',type:'text',sortable: true, filter: true, editable: true },
  { field: "friendships", headerName: 'friendships',type:'text',sortable: true, filter: true, editable: false },
]

export default {
  async created() {
    this.dataset = await getEveryone() // TODO find a less funky way to deal with refs and allow a service layer to directly trigger a render on dataset updates
    subscribeEveryone(this, 'dataset') // a rather funky attempt to allow functions in the sync module to directly update Vue data model and trigger rerender - a prep for "subscriptions"
  },
  data() {
    return {
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
    cellUpdated: async function cellUpdated(newData) {
      await updateRecord(newData)
      subscribeEveryone(this) // this will add the friendships and revisions
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
