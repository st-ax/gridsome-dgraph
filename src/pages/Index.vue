<template>
  <Layout>

    <!-- Learn how to use images here: https://gridsome.org/docs/images -->
     <CContainer  fluid>
      <CRow gutters>
        <CCol md class="text-center p-shadow-8 p-mr-2 p-p-3">
          <g-image alt="gridsome logo" src="~/favicon.png" width="135" />
        </CCol>
        <CCol md class="text-center p-shadow-8 p-mr-2 p-p-3">
          <g-image alt="Dgraph logo" src="https://dgraph.io/assets/images/favicons/android-icon-192x192.png"  style="height: 135px;"  />
        </CCol>
        <CCol md class="text-center p-shadow-8 p-p-3">
          <g-image alt="DB logo" src="/DexieLogo.png" style="height: 135px;" />
        </CCol>
      </CRow>
      <CRow gutters alignHorizontal="center">
        <CCol md class="text-center">
          <h1>Gridsome</h1>
        </CCol>
        <CCol md class="text-center">
          <h1>Dgraph</h1>
        </CCol>
        <CCol md  class="text-center">
          <h1>Dexie</h1>
        </CCol>
      </CRow>
    </CContainer>
   
    

    <p>
      This is a simple skeleton app that initializes a Dgraph DB with mockdata, <br>
      Renders the data from Dgraph into an expandable JSON tree, <br>
      and offers editing via vue-editable-grid.
    </p>

    <p>
      The offline-first via Dexie(idb) is still very early WIP.
    </p>

    <p class="home-links">
      <a href="https://gridsome.org/docs/" target="_blank" rel="noopener">Gridsome Docs</a>
      <a href="https://github.com/dgraph-io/dgraph" target="_blank" rel="noopener">Dgraph</a>
      <a href="https://github.com/eledwinn/vue-editable-grid" target="_blank" rel="noopener">vue-editable-grid</a>
      <a href="https://github.com/dfahlander/Dexie.js" target="_blank" rel="noopener">Dexie.js</a>
    </p>

  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'Dgraph offline-first'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
