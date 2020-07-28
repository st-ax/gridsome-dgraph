<template>
  <Layout>
    <h1>JSON editor</h1>
    <p v-for="eachItem in jsonDoc.items">
      {{ eachItem.id }}::{{ eachItem.name }}

  
    </p>
    <div style="height: 500px;"> <!-- The parent height is required -->
      <vue-editable-grid
        class="grid"
        ref="grid"
        :column-defs="columnDefs"
        :row-data="jsonDoc.items"
        row-data-key='id'
        @cell-updated="cellUpdated"
        @row-selected="rowSelected"
        @link-clicked="linkClicked"
      >
      
      </vue-editable-grid>
    </div>
  </Layout>
</template>

<script>
import { openDB, deleteDB, wrap, unwrap } from 'idb/with-async-ittr.js';

const columnDefs = [
  { field: "id", headerName: 'id', type:'numeric',sortable: true, filter: true, editable: true },
  { field: "type", headerName: 'type' ,type:'text',sortable: true, filter: true, editable: true },
  { field: "name", headerName: 'name',type:'text',sortable: true, filter: true, editable: true },
  { field: "ppu", headerName: 'ppu',type:'numeric',sortable: true, filter: true, editable: true },
]
const jsonDoc = {
	"items":
				[
					{
						"id": "0001",
						"type": "donut",
						"name": "Cake",
						"ppu": 0.55,
						"batters":
						
									[
										{ "id": "1001", "type": "Regular" },
										{ "id": "1002", "type": "Chocolate" },
										{ "id": "1003", "type": "Blueberry" },
										{ "id": "1004", "type": "Devil's Food" }
									],
						
						"toppings":
							[
								{ "id": "5001", "type": "None" },
								{ "id": "5002", "type": "Glazed" },
								{ "id": "5005", "type": "Sugar" },
								{ "id": "5007", "type": "Powdered Sugar" },
								{ "id": "5006", "type": "Chocolate with Sprinkles" },
								{ "id": "5003", "type": "Chocolate" },
								{ "id": "5004", "type": "Maple" }
							]
					},
					{
						"id": "0002",
						"type": "donut",
						"name": "Raised",
						"ppu": 0.55,
						"batters":
							
									[
										{ "id": "1001", "type": "Regular" }
									],

						"toppings":
							[
								{ "id": "5001", "type": "None" },
								{ "id": "5002", "type": "Glazed" },
								{ "id": "5005", "type": "Sugar" },
								{ "id": "5003", "type": "Chocolate" },
								{ "id": "5004", "type": "Maple" }
							]
					},
		
					{
						"id": "0003",
						"type": "donut",
						"name": "Old Fashioned",
						"ppu": 0.55,
						"batters":
									[
										{ "id": "1001", "type": "Regular" },
										{ "id": "1002", "type": "Chocolate" }
									],
						"toppings":
							[
								{ "id": "5001", "type": "None" },
								{ "id": "5002", "type": "Glazed" },
								{ "id": "5003", "type": "Chocolate" },
								{ "id": "5004", "type": "Maple" }
							]
					},
					
				]
		
}


let dbPromise, iDB,
  DB_NAME='bygonzDemoDB',
  SCHEMA_VERSION='1',
  initDB = async () => {
    console.log('initializing',DB_NAME, SCHEMA_VERSION)
    dbPromise = await openDB(DB_NAME, SCHEMA_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log('upgrading iDB to:', newVersion)
        db.createObjectStore('edibles',{
          keyPath: 'id',
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
    const iDB = {
      async get(key) {
        return dbPromise.get('edibles', key);
      },
      async set(key, val) {
        return dbPromise.put('edibles', val, key);
      },
      async delete(key) {
        return dbPromise.delete('edibles', key);
      },
      async clear() {
        return dbPromise.clear('edibles');
      },
      async keys() {
        return dbPromise.getAllKeys('edibles');
      },
    };
    console.log('iDB', iDB)
    return iDB
  }

export default {
  methods: {
    initDB,
    cellUpdated: async (newData) => {
      console.log(newData)
      console.log('in updated iDB', iDB)
      if(!iDB) console.log(await initDB())
      // const tx = iDB.transaction('edibles', 'readwrite');
      // const store = tx.objectStore('edibles');
      const val = (await iDB.get(newData.id)) || newData;
      console.log('current record:',val);
      await iDB.set(newData, newData.id);
      // await tx.done;
      
    },
    rowSelected: ({colData,colIndex,rowData,rowIndex}) => {
      console.log(colData.field,':',rowData[colData.field])
    },
    linkClicked: (args) => {
      console.log(args)
    },
  },
  data: ()=>({
    iDB,
    jsonDoc,
    columnDefs
  }),
  metaInfo: {
    title: 'About us'
  }
}
</script>
