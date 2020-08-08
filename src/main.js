// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import VueEditableGrid from 'vue-editable-grid'
import 'vue-editable-grid/dist/VueEditableGrid.css'
 
import TreeView from 'vue-json-tree-view'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

// import {Buefy} from 'https://unpkg.com/buefy/dist/buefy.min.js?module'
// import 'https://unpkg.com/buefy/dist/buefy.min.css'


export default function (Vue, { router, head, isClient }) {
  head.link.push({
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
  })
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  // register component in the Vue app
  Vue.component('vue-editable-grid', VueEditableGrid)

  Vue.use(TreeView)
  Vue.use(Buefy)

}
