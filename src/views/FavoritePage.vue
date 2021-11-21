<template>
  <ListPage :records="records" :isFavoritePage="true"/>
</template>

<script>
import ListPage from "@/views/ListPage.vue";

export default {
  name: "FavoritePage",
  components: {
    ListPage,
  },
  data() {
    return {
      records: {}
    }
  },
  mounted() {
    this.loadFavorite();
  },
  beforeRouteUpdate() {
    this.loadFavorite();
  },
  methods: {
    loadFavorite() {
      const result = {};
      Object.keys(this.$store.state.favoritePool.favoriteMap).forEach(
        (city) => {
          result[city] = this.$store.getters["busRoute/getRoutesInList"](
            city,
            Object.values(this.$store.state.favoritePool.favoriteMap[city])
          )[city] || { city, routes: [] };
        }
      );
      this.records =  result;
    },
  },
};
</script>