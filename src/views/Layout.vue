<template>
  <div class="layout">
    <header>
      <div class="container header-layout">
        <div class="logo-bar">
          <img class="logo-image" src="../assets/logo.svg" alt="Bus logo" />
        </div>
        <div class="search-bar">
          <SearchBar />
        </div>
        <div class="menu-bar">
          <div class="">
            我的最愛
          </div>
        </div>
      </div>
    </header>
    <router-view/>
    <footer>Copyright &copy; 2021 Double J. ALL Rights Reserved.</footer>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'

export default {
  name: 'Layout',
  components: {
    SearchBar
  },
  async mounted() {
  }
}
</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  vertical-align: center;
  background: #F4F5F9;

  & > * {
    flex-basis: 1;
    flex-grow: 1;
  }

  & > header, & > footer {
    flex: 0 0 auto;
    height: auto;
  }

  & > header {
    background: #040D2E;

    &::after {
      content: '';
      height: 5px;
      width: 100%;
      background: linear-gradient(90deg, #5468FF 0%, #01D8D0 100%);
    }
  }

  & .header-layout {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: stretch;
    justify-content: center;
    vertical-align: center;

    & > .logo-bar, & > .menu-bar {
      flex: 0 0 auto;
      width: auto;
    }

    & > .search-bar {
      flex-basis: 1;
      flex-grow: 1;
    }
  }
}
</style>
