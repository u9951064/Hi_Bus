<template>
  <ListPage :records="searchResults" />
</template>

<script>
import ListPage from "@/views/ListPage.vue";

export default {
  name: "FavoritePage",
  components: {
    ListPage,
  },
  computed: {
    searchResults() {
      const result = {};
      Object.keys(this.$store.state.favoritePool.favoriteMap).forEach(
        (city) => {
          result[city] = this.$store.getters["busRoute/getRoutesInList"](
            city,
            Object.values(this.$store.state.favoritePool.favoriteMap[city])
          )[city] || { city, routes: [] };
        }
      );
      return result;
    },
  },
};
</script>