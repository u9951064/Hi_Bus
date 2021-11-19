<template>
  <div class="layout">
    <header>
      <div
        class="container header-layout"
        :class="{ 'hide-mobile': mobileFullPageMode }"
      >
        <img
          class="logo btn"
          src="../assets/logo.svg"
          alt="Bus logo"
          @click="backToHome"
        />
        <div class="search-bar">
          <SearchBar v-if="!needHideSearchBar" />
        </div>
        <div class="menu-bar">
          <a class="nearby btn" @click="goToNearBy">
            <span class="menu-text">附近站牌</span>
          </a>
          <a class="favorite btn" @click="goToFavorite">
            <span class="menu-text">我的最愛</span>
          </a>
        </div>
      </div>
    </header>
    <router-view />
    <footer :class="{ 'hide-mobile': mobileFooterMode }">
      &copy; Hi BUS! | Designed by Joyce | Developed by Josh
    </footer>
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";

export default {
  name: "Layout",
  components: {
    SearchBar,
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
    goToNearBy() {
      return this.$router.push({
        name: "NearbyStations",
      });
    },
  },
  computed: {
    needHideSearchBar() {
      return !!(this.$route.meta.hideLayoutSearchBar || false);
    },
    mobileFullPageMode() {
      return !!(this.$route.meta.mobileFullPageMode || false);
    },
    mobileFooterMode() {
      return (
        !!(this.$route.meta.mobileFullPageMode || false) ||
        !!(this.$route.meta.mobileHideFooterMode || false)
      );
    },
  },
};
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
  background: #f4f5f9;

  & > * {
    flex-basis: 0;
    flex-grow: 1;
    max-height: 100%;
    align-content: center;
    overflow: hidden;
  }

  & > header,
  & > footer {
    flex: 0 0 auto;
    height: auto;
    max-height: 100%;
    overflow: initial;
  }

  & > header {
    background: #040d2e;
    &::after {
      content: "";
      display: block;
      height: 5px;
      width: 100%;
      background: linear-gradient(90deg, #5468ff 0%, #01d8d0 50%, #5468ff 100%);
      background-size: 200%;
      animation: gradient 3s ease infinite;
    }
  }

  & > footer {
    letter-spacing: 0.08em;
    font-size: 0.75rem;
    font-weight: 300;
    color: #8c90ab;
    padding: 0.5rem 0;

    @media(max-width: 767px) {
      font-size: 0.75rem;
      padding: 0.25rem 0 0.5rem;
      letter-spacing: 0.08em;
    }

    @media(max-width: 330px) {
      font-size: 0.5rem;
      padding: 0 0 0.5rem;
      letter-spacing: 0.01em;
    }
  }

  & .header-layout {
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
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

    & > .logo,
    & > .menu-bar {
      flex: 0 0 auto;
      width: auto;
      max-width: 100%;
      padding: 0.75rem 0;
      display: inline-flex;
    }

    & .menu-bar {
      align-self: center;
      color: #fff;

      & > * ~ * {
        margin-left: 1rem;
      }

      & > .nearby,
      & > .favorite {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;

        &:before {
          content: "";
          height: 1rem;
          width: 1rem;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          margin-left: 0.2rem;
          margin-right: 0.2rem;
        }

        @media (min-width: 769px) {
          &:hover {
            color: #ffc42d;
          }
        }
      }

      & > .nearby {
        &:before {
          background-image: url("../assets/icons/bubble-white-icon.svg");
        }
        @media (min-width: 769px) {
          &:hover:before {
            background-image: url("../assets/icons/bubble-yellow-icon.svg");
          }
        }
      }

      & > .favorite {
        &:before {
          background-image: url("../assets/icons/favorite-white-icon.svg");
        }
        @media (min-width: 769px) {
          &:hover:before {
            background-image: url("../assets/icons/favorite-yellow-icon.svg");
          }
        }
      }

      @media (max-width: 767px) {
        & .menu-text {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .layout {
    & .header-layout {
      justify-content: space-between;

      & > .menu-bar {
        order: 2;
      }
      & > .search-bar {
        order: 3;
        flex: 1 1 100%;
        width: 100%;
      }
    }
  }
}

@keyframes gradient {
  0% {
    background-position: 200% 0;
  }
  50% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0% 0;
  }
}
</style>
