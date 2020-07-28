// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import VueEditableGrid from 'vue-editable-grid'
import 'vue-editable-grid/dist/VueEditableGrid.css'
 
import VueJsonPretty from 'vue-json-pretty'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  // register component in the Vue app
  Vue.component('vue-editable-grid', VueEditableGrid)

  // register component in the Vue app
  Vue.component('vue-json-pretty', VueJsonPretty)
}
