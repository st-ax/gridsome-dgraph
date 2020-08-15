<template>
    <div>
    <header class="header">
      <CNavbar expandable="md" type="dark" color="info">
        <CNavbarBrand href="https://coreui.io/vue/docs/introduction/" target="_blank" rel="nofollow">
          <CIcon size="xl" :content="cibCoreuiC" />
        </CNavbarBrand>
        <CCollapse :show="collapsed" navbar>
          <CNavbarNav>
            <CNavItem href="/">HOME</CNavItem>
          </CNavbarNav>
          <CNavbarNav>
            <CNavItem href="/edit">EDITOR</CNavItem>
          </CNavbarNav>

          <!-- Right aligned nav items -->
          <CNavbarNav class="ml-auto">
            <CForm inline>
              <CInput
                class="mr-sm-2"
                placeholder="Search"
                size="sm"
              />
              <CButton
                color="secondary"
                size="sm" 
                class="my-2 my-sm-0" 
                type="submit"
              >
                Search
              </CButton>
            </CForm>

            <CDropdown
              togglerText="Lang"
              nav
              placement="bottom-end"
            >
                <CDropdownItem>EN</CDropdownItem>
                <CDropdownItem>ES</CDropdownItem>
                <CDropdownItem>RU</CDropdownItem>
                <CDropdownItem>FA</CDropdownItem>
            </CDropdown>

            <CDropdown
              nav
              togglerText="User"
              placement="bottom-end"
            >
              <CDropdownItem>Profile</CDropdownItem>
              <CDropdownItem>Signout</CDropdownItem>
            </CDropdown>
          </CNavbarNav>
        </CCollapse>
      </CNavbar>
    </header>
    <div class="layout">
      <slot />
    </div>
  </div>
</template>

<script>
import { 
  CNavbar,
  CNavbarBrand,
  CIcon,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CForm,
  CInput,
  CButton, 
  CDropdown,
  CDropdownItem } from '@coreui/vue/dist/coreui-vue.umd.min' /// app.js dropped from 9.3MB to 8.1MB by adding /dist/coreui-vue.umd.min
import { cibCoreui } from '@coreui/icons/js/brand/cib-coreui'
import { cibCoreuiC } from '@coreui/icons/js/brand/cib-coreui-c'
export default {
  components:{
    // cibCoreuiC  // didn't work for icon
    CNavbar,
    CNavbarBrand,
    CIcon,
    CCollapse,
    CNavbarNav,
    CNavItem,
    CForm,
    CInput,
    CButton, 
    CDropdown,
    CDropdownItem
  },
  // icons: {
  //   cibCoreui, // requires reference like this :content="$options.icons.cibCoreui"
  //   cibCoreuiC
  // },
  // mounted() {
  //   setTimeout(()=>{this.cibCoreuiC = cibCoreuiC},500) // weird hack to avoid the icon flashing huge before the rest of the css loads
  // },
  data() {
    return {
      cibCoreuiC, // preferred for simpler reference :content="cibCoreui"
      collapsed:false
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
  height: 70px;
  width: 100%;
}
.logo {
  transform: scale(0.5);
  margin-bottom: -20px;
}
.navbar {
    height: 80px;
    width: 100%;
}
.nav__link {
  margin-left: 20px;
}
</style>
