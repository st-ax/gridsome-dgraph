<template>
    <div>
    <header class="header">
      <CNavbar expandable="md" type="dark" color="info">
        <CNavbarBrand href="#">
          <svg class="logo">
            <g id="Page-1" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
              <g id="coreui-base" fill="currentColor" fill-rule="nonzero">
                <g id="Group">
                <path d="M96,24.1244 L57,1.6077 C53.2871871,-0.535893539 48.7128129,-0.535893539 45,1.6077 L6,24.1243 C2.29226017,26.2730089 0.00693260339,30.2313486 0,34.5167 L0,79.55 C0.0068453397,83.8353487 2.29220098,87.7936989 6,89.9423 L45,112.459 C48.7128129,114.602594 53.2871871,114.602594 57,112.459 L96,89.9423 C99.707799,87.7936989 101.993155,83.8353487 102,79.55 L102,34.5167 C101.993093,30.2313678 99.707754,26.273046 96,24.1244 Z M94,79.55 C94,80.9790618 93.2376038,82.2995691 92,83.0141 L53,105.5308 C51.7623957,106.245331 50.2376043,106.245331 49,105.5308 L10,83.0141 C8.76239619,82.2995691 8,80.9790618 8,79.55 L8,34.5167 C8,33.0876382 8.76239619,31.7671309 10,31.0526 L49,8.5359 C50.2376043,7.82136882 51.7623957,7.82136882 53,8.5359 L92,31.0526 C93.2376038,31.7671309 94,33.0876382 94,34.5167 L94,79.55 Z" id="Shape"></path>
                <path d="M74.0216,70.0713 L71.1556,70.0713 C70.4827679,70.0712861 69.8208069,70.2410241 69.231,70.5648 L51.95,80.05 L32,68.5315 L32,45.554 L51.95,34.0354 L69.2394,43.4904 C69.8278903,43.8122245 70.4878603,43.9808965 71.1586,43.9809 L74.0218,43.9809 C75.1263695,43.9809 76.0218,43.0854695 76.0218,41.9809 L76.0218,39.2691 C76.0218,38.5380907 75.6230914,37.8652844 74.9818,37.5144 L55.793,27.0188 C53.3404536,25.684951 50.3714915,25.7190213 47.9502,27.1088 L28,38.6262 C25.5283249,40.0590349 24.0048565,42.6979488 24,45.5549 L24,68.5309 C24,71.3890593 25.5247614,74.0301204 28,75.4592 L47.95,86.9778 C50.3719859,88.3663725 53.3408028,88.399644 55.7933,87.0657 L74.9833,76.5345 C75.6233016,76.1832775 76.0210885,75.5112406 76.0211,74.7812 L76.0211,72.0712 C76.0210448,70.9668648 75.1259352,70.0715761 74.0216,70.0713 Z" id="Path"></path>
                </g>
              </g>
            </g>
          </svg>
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
export default {
  // components:{
  //   Menubar
  // },
  data() {
    return {
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
