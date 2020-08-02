<template>
  <Layout>

    <!-- Learn how to use images here: https://gridsome.org/docs/images -->
    <g-image alt="gridsome logo" src="~/favicon.png" width="135" />
    <g-image alt="Dgraph logo" src="https://dgraph.io/assets/images/favicons/android-icon-192x192.png"  style="height: 135px;"  />
    <g-image alt="DB logo" src="https://api-db.com/images/database.png" style="height: 135px;" />

    <h1>Gridsome + Dgraph + idb</h1>

    <p>
      This is a simple skeleton app that initializes a Dgraph DB with mockdata, <br>
      Renders the data from Dgraph into an expandable JSON tree, <br>
      and offers editing via vue-editable-grid.
    </p>

    <p>
      The offline-first via idb is still very early WIP.
    </p>

    <p class="home-links">
      <a href="https://gridsome.org/docs/" target="_blank" rel="noopener">Gridsome Docs</a>
      <a href="https://github.com/dgraph-io/dgraph" target="_blank" rel="noopener">Dgraph</a>
      <a href="https://github.com/eledwinn/vue-editable-grid" target="_blank" rel="noopener">vue-editable-grid</a>
      <a href="https://github.com/jakearchibald/idb" target="_blank" rel="noopener">idb</a>
    </p>

  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'Hello, world!'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
