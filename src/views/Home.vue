<template>
  <div class="home-page">
    <h1 class="home-title-block col-auto">Hi BUS!</h1>
    <h2 class="home-slogan-block col-auto">今天想搭乘哪輛公車呢？</h2>
    <div class="home-search-block col-auto">
      <SearchBar :atHomePage="true" />
    </div>
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  padding: 10% 0 0 0;

  & .home-title-block {
    margin: 0;
    font-weight: 900;
    font-size: 2rem;
    letter-spacing: 0.06em;
    padding: 0 0 1rem 0;
  }

  & .home-slogan-block {
    margin: 0;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    padding: 0 0 1.5rem 0;
  }

  & .home-search-block {
    padding: 0 0 2rem 0;
  }
}
</style>
