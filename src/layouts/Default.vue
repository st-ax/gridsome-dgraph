<template>
  <div class="layout">
    <header class="header">
      <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                    alt="Lightweight UI components for Vue.js based on Bulma"
                >
                <strong>
                  <g-link to="/">Home</g-link>
                </strong>
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item>
              <g-link class="nav__link" to="/edit/">Editable Grid</g-link>
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
              <b-navbar-dropdown label="Info">
                <b-navbar-item href="#">
                <!-- <div class="buttons"> -->
                  <a class="button is-primary">
                      <strong>Sign up</strong>
                  </a>
                <!-- </div> -->
                </b-navbar-item>
                <b-navbar-item href="#">
                    About
                </b-navbar-item>
                <b-navbar-item href="#">
                    Contact
                </b-navbar-item>
            </b-navbar-dropdown>
                <!--  -->
            </b-navbar-item>
             <b-navbar-item>
                <g-link to="https://github.com/st-ax/gridsome-dgraph">
                  <b-icon
                      icon="github"
                      size="is-large"
                      type="">
                  </b-icon>
                </g-link>
            </b-navbar-item>
        </template>
    </b-navbar>

    </header>
    <slot/>
  </div>
</template>

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
