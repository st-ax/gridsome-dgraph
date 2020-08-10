// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

import VueEditableGrid from 'vue-editable-grid'
import 'vue-editable-grid/dist/VueEditableGrid.css'

import TreeView from 'vue-json-tree-view'

import CoreuiVue from '@coreui/vue';


const cssURLs = [
  'https://cdn.jsdelivr.net/npm/@coreui/coreui/dist/css/coreui.min.css', // this should contain most/all bootstrap css plus the coreui extensions
  'https://unpkg.com/primeflex@2.0.0-rc.1/primeflex.css', // included for shortcut classes for elevation etc.
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

  // register components:
  Vue.component('vue-editable-grid', VueEditableGrid)
  Vue.use(TreeView)

  // Register Primary UI Library:
  Vue.use(CoreuiVue) // Full import disables tree shaking TODO see: https://coreui.io/vue/docs/introduction/#optimization

}
