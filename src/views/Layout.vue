<template>
  <div class="layout">
    <header>
      <div class="container header-layout">
        <img class="logo btn" src="../assets/logo.svg" alt="Bus logo" @click="backToHome"/>
        <div class="search-bar">
          <SearchBar v-if="!needHideSearchBar"/>
        </div>
        <div class="menu-bar">
          <a class="favorite btn" @click="goToFavorite">我的最愛</a>
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
  methods: {
    backToHome() {
      return this.$router.push({
        name: "Home",
      });
    },
    goToFavorite() {
      return this.$router.push({
        name: "Favorite",
      });
    },
  },
  computed: {
    needHideSearchBar() {
      return !!(this.$route.meta.hideLayoutSearchBar || false);
    }
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
  align-items: center;
  justify-items: stretch;
  align-items: stretch;
  background: #F4F5F9;

  & > * {
    flex-basis: 0;
    flex-grow: 1;
    max-height: 100%;
    align-content: center;
    overflow: hidden;
  }

  & > header, & > footer {
    flex: 0 0 auto;
    height: auto;
    max-height: 100%;
    overflow: initial;
  }

  & > header {
    background: #040D2E;
    padding: 1rem; 

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
    align-items: stretch;
    justify-items: center;

    & > * {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      align-content: center;
    }

    & .btn {
      cursor: pointer;
    }

    & > .logo, & > .menu-bar {
      flex: 0 0 auto;
      width: auto;
      max-width: 100%;
    }

    & .menu-bar {
      align-self: center;
      color: #FFF;

      & .favorite {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;

        &:before {
          content: '';
          height: 1rem;
          width: 1rem;
          background-image: url('../assets/icons/favorite-white-icon.svg');
          background-size: cover;
          margin-right: 0.2rem;
        }

        &:hover {
          color: #FFC42D;

          &:before {
            background-image: url('../assets/icons/favorite-yellow-icon.svg');
          }
        }
      }
    }
  }
}
</style>
