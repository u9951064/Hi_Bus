<template>
  <div class="search-suggestion-list">
    <div class="city-group" v-for="c in searchResults" :key="c.city">
      <div class="city-name">{{ c.cityName }}</div>
      <div class="route-item" v-for="r in c.routes" :key="r.uniqueIndex" @click="selectRoute(r)">
        <div class="route-item-name">{{ r.subRouteName}}</div>
        <div class="route-item-headSign">{{ r.headSign }}</div>
      </div>
    </div>
    <div v-if="searchResults.length === 0">查無符合的結果</div>
  </div>
</template>

<script>
export default {
  name: 'SearchSuggestionList',
  props: {
    selectedCity: {
      type: String,
      required: true,
    },
    inputKeyword: {
      type: String,
      required: true,
    }
  },
  mounted() {
  },
  methods: {
    selectRoute(route) {
      this.$store.commit('routeSelector/setSelectedCity', this.selectedCity);
      this.$store.commit('routeSelector/setInputKeyword', this.inputKeyword);

      // TODO: redirect to route detail page
      this.$store.commit('routeSelector/setSelectedRoute', route);
    }
  },
  computed: {
    searchResults() {
      return Object.values(this.$store.getters['busRoute/searchRoutes'](this.selectedCity, this.inputKeyword)).filter(d => d.routes.length !== 0);
    },
  }
}
</script>

<style scoped lang="scss">
.search-suggestion-list {
  width: 100%;
  max-width: 100%;

  & .city-group ~ .city-group {
    padding-top: 0.75rem;
  }

  & .city-name {
    color: #5468FF;
    text-align: left;
  }

  & .route-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-items: center;
    align-items: center;
    border-bottom: 1px solid #EDEEF2;

    &:hover {
      background: #F7F7FA;
      cursor: pointer;
    }

    & > * {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      align-content: left;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      text-align: left;
    }
    
    & .route-item-name {
      flex: 1 1 30%;
      width: 30%;
      max-width: 30%;
    }
  }
}
</style>
