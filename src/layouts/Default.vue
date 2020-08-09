<template>
  <div class="layout">
    <header class="header">
      <Menubar :model="items">
          <template #start>
            <strong>
              <g-link class="nav__link" to="/">{{ $static.metadata.siteName }}</g-link>
            </strong>
          </template>
      </Menubar>
    </header>
    <slot/>
  </div>
</template>

<script>
import Menubar from 'primevue/menubar';
export default {
  components:{
    Menubar
  },
  data() {
    return {
      items: [
                {
                   label:'More',
                   icon:'pi pi-fw pi-file',
                   items:[
                      {
                         label:'New',
                         icon:'pi pi-fw pi-plus',
                         items:[
                            {
                               label:'Bookmark',
                               icon:'pi pi-fw pi-bookmark'
                            },
                            {
                               label:'Video',
                               icon:'pi pi-fw pi-video'
                            },

                         ]
                      },
                      {
                         label:'Delete',
                         icon:'pi pi-fw pi-trash'
                      },
                      {
                         separator:true
                      },
                      {
                         label:'Export',
                         icon:'pi pi-fw pi-external-link'
                      }
                   ]
                },
                 {
                   label:'Editable Grid',
                   icon:'pi pi-fw pi-list',
                   to:'/edit/',
                 }
              ]
          }
  }
}
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
}

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.nav__link {
  margin-left: 20px;
}
</style>
