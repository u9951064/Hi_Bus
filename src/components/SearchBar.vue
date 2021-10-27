<template>
  <div class="search">
    <div class="city-selector">
      <select v-model="selectedCity">
        <option value="">全部縣市</option>
        <option v-for="o in cityOptions" :key="o.city" :value="o.city">{{ o.cityName }}</option>
      </select>
    </div>
    <div class="keyword-input">
      <input type="text" v-model.trim="routeKeyword" placeholder="搜尋公車路線"/>
    </div>
    <div class="search-btn">
      <img src="../assets/icons/search-icon.svg" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'SearchBar',
  methods: {

  },
  computed: {
    ...mapState('busRoute', {
      cityOptions: 'cityOptions',
    }),
    selectedCity: {
      get() { return this.$store.state.routeSelector.selectedCity; },
      set(v) {this.$store.commit('routeSelector/setSelectedCity', `${v}`);},
    },
    routeKeyword: {
      get() { return this.$store.state.routeSelector.inputKeyword; },
      set(v) {this.$store.commit('routeSelector/setInputKeyword', `${v}`);},
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  max-width: 550px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  background: #252E4F;
  border-radius: 0.5rem;
  padding: 0.75rem;

  & > * {
    flex-grow: 1;
    flex-basis: 1;
  }
  & .city-selector, & .search-btn {
    flex: 0 0 auto;
    width: auto;
  }

  & .search-btn {
    cursor: pointer;
  }

  & select, & input {
    width: 100%;
    background: none;
    color: #FFF;
    padding: 0.5rem 1.5rem;
    border: none;
  }

  & input::placeholder {
    color: #FFF;
  }
}
</style>
