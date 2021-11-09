<template>
  <div class="search-suggestion-list">
    <div class="city-group" v-for="c in searchResults" :key="c.city">
      <div class="city-name">{{ c.cityName }}</div>
      <div
        class="route-item"
        v-for="r in c.routes"
        :key="r.uniqueIndex"
        @click="selectRoute(r)"
      >
        <div
          class="route-item-name"
          v-html="getSearchText(r.subRouteName)"
        ></div>
        <div
          class="route-item-headSign"
          v-html="getSearchText(r.headSign)"
        ></div>
      </div>
    </div>
    <div v-if="searchResults.length === 0">查無符合的結果</div>
  </div>
</template>

<script>
import replaceSymbol from "@/utils/replaceSymbol"
import highlightKeyword from "@/utils/highlightKeyword"

export default {
  name: "SearchSuggestionList",
  props: {
    selectedCity: {
      type: String,
      required: true,
    },
    inputKeyword: {
      type: String,
      required: true,
    },
  },
  methods: {
    getSearchText(text) {
      return highlightKeyword(replaceSymbol(text), this.inputKeyword);
    },
    selectRoute(route) {
      this.$emit("input");
      this.$store.commit("routeSelector/setSelectedRoute", route);
      this.$store.commit("routeSelector/setSelectedCity", route.city);
      this.$store.commit("routeSelector/setInputKeyword", route.subRouteName);
      this.$store.commit("routeSelector/setSearchCity", route.city);
      this.$store.commit("routeSelector/setSearchKeyword", route.subRouteName);

      return this.$router.push({
        name: "TracingBus",
        params: {
          uniqueIndex: route.uniqueIndex,
        },
      });
    },
  },
  computed: {
    searchResults() {
      return Object.values(
        this.$store.getters["busRoute/searchRoutes"](
          this.selectedCity,
          this.inputKeyword
        )
      ).filter((d) => d.routes.length !== 0);
    },
  },
};
</script>

<style scoped lang="scss">
.search-suggestion-list {
  width: 100%;
  max-width: 100%;

  & > .city-group {
    text-align: left;
    & > .city-name {
      color: #5468FF;
      padding: 0.25rem 0;
      letter-spacing: 0.02em;
      font-size: 0.75rem;
    }

    & > .route-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid #E7E9F2;

      & > .route-item-name {
        flex: 1 1 30%;
        max-width: 30%;
        font-weight: 600;
        font-size: 1rem;
        padding: 0.75rem 0;
      }

      & > .route-item-headSign {
        flex: 1 1 70%;
        max-width: 70%;
        font-size: 1rem;
        padding: 0.75rem 0 0.75rem 0.25rem;
      }

      @media(min-width: 768px) {
        &:hover {
          background: #F8F8FB;
        }
      }
    }
  }
}
</style>
