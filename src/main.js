// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import VueEditableGrid from 'vue-editable-grid'
import TreeView from 'vue-json-tree-view'

import 'vue-editable-grid/dist/VueEditableGrid.css'
import 'primeflex/primeflex.css' 

const cssURLs = [
  'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
  'https://unpkg.com/primevue/resources/themes/saga-purple/theme.css',
  'https://unpkg.com/primeicons/primeicons.css',

]
export default function (Vue, { router, head, isClient }) {
  for(let eachURL of cssURLs){
    head.link.push({
      rel: 'stylesheet',
      href: eachURL,
    })
  }
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  // register component in the Vue app
  Vue.component('vue-editable-grid', VueEditableGrid)

  Vue.use(TreeView)
  // register component in the Vue app
  // Vue.component('json-tree-view', TreeView)
}
