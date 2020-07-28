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
const columnDefs = [
  { field: "id", type:'numeric',sortable: true, filter: true, editable: true },
  { field: "type",type:'text',sortable: true, filter: true, editable: true },
  { field: "name",type:'text',sortable: true, filter: true, editable: true },
  { field: "ppu",type:'numeric',sortable: true, filter: true, editable: true },
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
export default {
  cellUpdated: (newData,oldData) => {
    console.log(newData,oldData);
  }
  data: ()=>({
    jsonDoc,
    columnDefs
  }),
  metaInfo: {
    title: 'About us'
  }
}
</script>
