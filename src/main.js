// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

import VueEditableGrid from 'vue-editable-grid/dist/VueEditableGrid.umd.min' // this made a difference - apparently editable grid is not using the minified version automatically
import 'vue-editable-grid/dist/VueEditableGrid.css'

import TreeView from 'vue-json-tree-view' // already using a minified version

// import CoreuiVue from '@coreui/vue'; // Full import disabled - using tree shaking see: https://coreui.io/vue/docs/introduction/#optimization
import "@coreui/coreui/dist/css/coreui.min.css" // loading via css CDN below results in a FOUC so I prefer to beef up the app.js - TODO test in production builds

const linkURLs = [
  // ['preload','text/css','https://cdn.jsdelivr.net/npm/@coreui/coreui/dist/css/coreui.min.css','style'], // is never applied (even with as="style")
  // ['stylesheet','text/css','https://cdn.jsdelivr.net/npm/@coreui/coreui/dist/css/coreui.min.css'], // FOUCed
  // ['preload','image/svg+xml', 'https://unpkg.com/@coreui/icons@1.0.1/sprites/brand.svg'], // preload attempt - failed
  ['stylesheet','text/css','https://unpkg.com/primeflex@2.0.0-rc.1/primeflex.css'], // included for shortcut classes for elevation etc.
]
export default function (Vue, { router, head, isClient }) {
  for(let [rel, type, href,as] of linkURLs){
    head.link.push({
      rel,
      type,
      href,
      as
    })
  }
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  // register components:
  Vue.component('vue-editable-grid', VueEditableGrid)
  Vue.use(TreeView)
  
  // Register Primary UI Library:
  // Vue.use(CoreuiVue) // Full import disabled - using tree shaking see: https://coreui.io/vue/docs/introduction/#optimization
  
  // ===== Didn't work:
  // Vue.component('cibCoreuiC',cibCoreuiC)
  // Vue.component.icons = {
  //   cibCoreuiC
  // }
}
