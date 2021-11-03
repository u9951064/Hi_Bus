<template>
  <div class="search" :class="{active: active}">
    <select class="city-selector" v-model.trim="selectedCity" @focus="focusHandler" @blur="blurHandler">
      <option value="">全部縣市</option>
      <option v-for="o in cityOptions" :key="o.city" :value="o.city">{{ o.cityName }}</option>
    </select>
    <div class="separator"></div>
    <input class="keyword-input" type="text" placeholder="搜尋公車路線" ref="keywordInput" v-model.trim="inputKeyword" @focus="focusHandler" @blur="blurHandler"/>
    <div class="search-btn" @click="searchHandler">
      <img v-if="active" src="../assets/icons/search-dark-icon.svg" alt="查詢" />
      <img v-else src="../assets/icons/search-white-icon.svg" alt="查詢" />
    </div>
    <div class="suggestion-block" @mouseenter="enterHandler(true)" @mouseleave="enterHandler(false)" @click="focusInput">
      <div class="suggestion-inner">
        <SearchSuggestionInput v-show="inputKeyword === ''" @input="setupInput"/>
        <SearchSuggestionList v-if="inputKeyword !== ''" :selectedCity="selectedCity" :inputKeyword="inputKeyword" @input="setupInput"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchSuggestionList from './SearchSuggestionList.vue'
import SearchSuggestionInput from './SearchSuggestionInput.vue'

export default {
  name: 'SearchBar',
  components: {
    SearchSuggestionList,
    SearchSuggestionInput,
  },
  data() {
    return {
      inWatchRegion: false,
      active: false,
      selectedCity: '',
      inputKeyword: '',
    }
  },
  mounted() {
    this.selectedCity = this.$store.state.routeSelector.selectedCity;
    this.inputKeyword = this.$store.state.routeSelector.inputKeyword;
  },
  methods: {
    focusInput() {
      this.$refs.keywordInput.focus();
    },
    enterHandler(state) {
      this.inWatchRegion = state;
    },
    focusHandler() {
      this.active = true;
    },
    blurHandler() {
      if(this.inWatchRegion) {
        this.active = true;
      } else {
        this.active = false;
      }
    },
    searchHandler() {
      this.$store.commit('routeSelector/setSelectedCity', this.selectedCity);
      this.$store.commit('routeSelector/setInputKeyword', String(this.inputKeyword));
      this.$router.push({
        name: "SearchResult",
        query: {
          city: this.selectedCity,
          keyword: this.inputKeyword,
        },
      });
    },
    setupInput(keyword, city) {
      this.focusInput();
      this.inputKeyword = keyword;
      this.selectedCity = city === undefined ? this.selectedCity : city;
    }
  },
  computed: {
    ...mapState('busRoute', {
      cityOptions: 'cityOptions',
    }),
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
  align-items: center;
  background: #252E4F;
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  position: relative;

  &.active {
    background: #FFFFFF;
    border-radius: 0.5rem 0.5rem 0 0 ;
  }

  & > * {
    flex-basis: 0;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
    align-content: center;
  }

  & .city-selector, & .search-btn {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }

  & .separator {
    flex: 0 0 0.75rem;
    width: 0.75rem;
    height: 1rem;
    border-right: 1px solid #FFF;
  }

  &.active .separator {
    border-right: 1px solid #C3CBE4;
  }

  & .search-btn {
    cursor: pointer;
    padding: 0.5rem 1.25rem;
    align-self: center;
    align-content: center;
    & img {
      width: auto;
      height: 1rem;
    }
  }

  & select, & input, & input::placeholder{
    color: #FFF;
  }

  &.active select, &.active input, &.active input::placeholder{
    color: #040D2E;
  }

  & input:focus, & select:focus{
      outline: none;
  }

  & select, & input {
    background: none;
    padding: 0 0.75rem;
    border: none;
  }

  & .suggestion-block {
    position: absolute;
    z-index: 5;
    flex: 1 1 100%;
    width: 100%;
    background: #FFF;
    top: 100%;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: 0px 0.25rem 1rem rgb(228 231 240 / 80%);

    &:before {
      content: '';
      display: block;
      width: calc(100% - 1.5rem);
      height: 1px;
      background: #C3CBE4;
      margin: auto;
    }

    & > .suggestion-inner {
      display: block;
      width: 100%;
      height: auto;
      max-height: 40vh;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0.5rem 0.75rem;
    }
  }

  &:not(.active) .suggestion-block {
    display: none;
  }
}
</style>
