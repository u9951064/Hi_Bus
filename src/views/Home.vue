<template>
  <div class="home-page">
    <h1 class="home-title-block col-auto">
      <img class="home-logo" src="../assets/home-logo.svg" />
    </h1>
    <h2 class="home-slogan-block col-auto">今天想搭乘哪輛公車呢？</h2>
    <div class="home-search-block col-auto">
      <SearchBar :atHomePage="true" />
    </div>
    <img class="bus-animation" src="../../public/gif/bus.gif" />
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";

export default {
  name: "Home",
  components: {
    SearchBar,
  },
  methods: {
    backToHome() {
      return this.$router.push({
        name: "Home",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  padding: 5% 0 0 0;

  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center 80%;
  background-image: url("../../public/img/bg-xl.svg");
  @media (max-width: 1023px) {
    background-image: url("../../public/img/bg-md.svg");
  }
  @media (max-width: 767px) {
    background-image: url("../../public/img/bg-sm.svg");
  }

  & > .bus-animation {
    position: absolute;
    bottom: 3%;

    animation-iteration-count: infinite;
    animation-timing-function: ease;
    animation-name: bus-animation-xl;
    animation-duration: 23s;
    width: 15%;

    @media (max-width: 1023px) {
      animation-name: bus-animation-md;
      animation-duration: 18s;
      width: 25%;
    }
    @media (max-width: 767px) {
      animation-name: bus-animation-sm;
      animation-duration: 15s;
      width: 40%;
    }
  }

  & > .home-title-block {
    margin: 0;
    font-weight: 900;
    font-size: 2rem;
    letter-spacing: 0.06em;
    padding: 5vh 0 0.25rem 0;

    @media (max-width: 767px) {
      padding-top: 4.375rem;
    }

    & > .home-logo {
      @media (max-width: 767px) {
        width: 9rem;
      }
    }
  }

  & > .home-slogan-block {
    margin: 0;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    padding: 0 0 1.5rem 0;

    @media(max-width: 767px) {
      font-size: 1rem;
    }
  }

  & > .home-search-block {
    padding: 0 1rem 2rem 1rem;
  }
}

@keyframes bus-animation-xl {
  0% {
    left: -20%;
  }
  30% {
    left: 20%;
  }
  60% {
    left: 60%;
  }
  100% {
    left: 120%;
  }
}

@keyframes bus-animation-md {
  0% {
    left: -30%;
  }
  30% {
    left: 20%;
  }
  60% {
    left: 60%;
  }
  100% {
    left: 130%;
  }
}

@keyframes bus-animation-sm {
  0% {
    left: -60%;
  }
  40% {
    left: 30%;
  }
  100% {
    left: 160%;
  }
}
</style>
