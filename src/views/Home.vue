<template>
  <div class="home-page">
    <h1 class="home-slogan-block col-auto">Hi，你今天想搭乘輛公車？</h1>
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
  justify-content: center;
  align-items: stretch;

  & .home-slogan-block {
    font-weight: 900;
    font-size: 1.25rem;
    letter-spacing: 0.06em;
    padding: 0 0 2rem 0;
  }

  & .home-search-block {
    padding: 0 0 2rem 0;
  }
}
</style>
