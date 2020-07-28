<template>
  <Layout>
    <h1>JSON editor</h1>
     <tree-view
      :data="dataset"
      :options="{
        modifiable: true,
        maxDepth: 2}"
      @change-data="treeUpdated">
    </tree-view>
    <div style="height: 500px;"> <!-- The parent height is required -->
      <vue-editable-grid
        class="grid"
        ref="grid"
        :column-defs="columnDefs"
        :row-data="dataset || []"
        row-data-key='uid'
        @cell-updated="cellUpdated"
        @row-selected="rowSelected"
        @link-clicked="linkClicked"
      >
      
      </vue-editable-grid>
    </div>
  </Layout>
</template>

<script>
import { openDB, deleteDB, wrap, unwrap } from 'idb/with-async-ittr.js'
import { queryData, mutateData } from '../dgraph/dgraph'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff'

const columnDefs = [
  { field: "uid", headerName: 'uid', type:'text',sortable: true, filter: true, editable: true },
  { field: "name", headerName: 'name',type:'text',sortable: true, filter: true, editable: true },
  { field: "friendship", headerName: 'friendship',type:'text',sortable: true, filter: true, editable: true },
]



let dbPromise, iDB,
  DB_NAME='bygonzDemoDB',
  SCHEMA_VERSION='1',
  initDB = async () => {
    console.log('initializing',DB_NAME, SCHEMA_VERSION)
    dbPromise = await openDB(DB_NAME, SCHEMA_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log('upgrading iDB to:', newVersion)
        db.createObjectStore('people',{
          keyPath: 'uid',
        })
      },
      blocked() {
        // …
      },
      blocking() {
        // …
      },
      terminated() {
        // …
      },
    })
    
    iDB = {
      async get(key) {
        return dbPromise.get('people', key);
      },
      async set(val,key) {
        return dbPromise.put('people', val, key);
      },
      async delete(key) {
        return dbPromise.delete('people', key);
      },
      async clear() {
        return dbPromise.clear('people');
      },
      async keys() {
        return dbPromise.getAllKeys('people');
      },
    };
    console.log('iDB', iDB)
    return iDB
  }

export default {
  
  async created() {
    this.initDB()
   
    queryData().then((res) => {
      console.log("\nDONE!",res);
      this.dataset = res.everyone || []
    }).catch((e) => {
      console.log("ERROR: ", e);
    });
  },
    data: ()=>({
    iDB,
    dbPromise,
    dataset: [],
    columnDefs
  }),
  methods: {
    initDB,
    treeUpdated: async (newData) => {
      console.log('treeUpdated:', newData)
      const changeSet= updatedDiff(this.dataset,newData)
      console.log('changed:', changeSet)
    },
    cellUpdated: async (newData) => {
      console.log('cellUpdated:', newData)
      // console.log('in updated iDB', iDB)
      if(!iDB) console.log('needed to init:', await initDB())
      // const tx = iDB.transaction('people', 'readwrite');
      // const store = tx.objectStore('people');
      const val = (await iDB.get(newData.row.uid)) || newData;
      console.log('current record:',val);
      await iDB.set(newData.row);
      const mu = `
        <${newData.row.uid}> <${newData.column.field}@en> "${newData.value}" .
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
    title: 'About us'
  }
}
</script>
