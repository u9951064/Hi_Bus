<template>
  <ListPage :records="searchResults" />
</template>

<script>
import ListPage from "@/views/ListPage.vue";

export default {
  name: "SearchResult",
  components: {
    ListPage,
  },
  computed: {
    searchResults() {
      return this.$store.getters["busRoute/searchRoutes"](
        this.$store.state.routeSelector.selectedCity,
        this.$store.state.routeSelector.inputKeyword
      );
    },
  },
};
</script>