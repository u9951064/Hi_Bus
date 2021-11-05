<template>
  <div class="search" :class="{ active: active }">
    <select
      class="city-selector"
      v-model.trim="selectedCity"
      @focus="focusHandler"
      @blur="blurHandler"
    >
      <option value="">全部縣市</option>
      <option v-for="o in cityOptions" :key="o.city" :value="o.city">
        {{ o.cityName }}
      </option>
    </select>
    <div class="separator"></div>
    <input
      class="keyword-input"
      type="text"
      placeholder="搜尋公車路線"
      ref="keywordInput"
      v-model.trim="inputKeyword"
      @focus="focusHandler"
      @blur="blurHandler"
      @keyup.enter="searchHandler"
      @keyup.esc="unFocusHandler"
    />
    <div class="search-btn" @click="searchHandler">
      <img :src="searchIconSrc" alt="查詢" />
    </div>
    <div
      class="suggestion-block"
      @mouseenter="enterHandler(true)"
      @mouseleave="enterHandler(false)"
    >
      <div class="suggestion-inner">
        <SearchSuggestionInput
          v-show="inputKeyword === ''"
          @input="focusInput"
        />
        <SearchSuggestionList
          v-if="inputKeyword !== ''"
          :selectedCity="selectedCity"
          :inputKeyword="inputKeyword"
          @input="unFocusHandler"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SearchSuggestionList from "./SearchSuggestionList.vue";
import SearchSuggestionInput from "./SearchSuggestionInput.vue";

export default {
  name: "SearchBar",
  components: {
    SearchSuggestionList,
    SearchSuggestionInput,
  },
  data() {
    return {
      inWatchRegion: false,
      active: false,
    };
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
      if (this.inWatchRegion) {
        this.active = true;
      } else {
        this.active = false;
      }
    },
    unFocusHandler() {
      this.enterHandler(false);
      this.blurHandler();
      this.$refs.keywordInput.blur();
    },
    searchHandler() {
      this.$store.commit("routeSelector/setSelectedCity", this.selectedCity);
      this.$store.commit("routeSelector/setInputKeyword", this.inputKeyword);
      this.unFocusHandler();
      this.$router.push({
        name: "SearchResult",
        query: {
          city: this.selectedCity,
          keyword: this.inputKeyword,
        },
      });
    },
  },
  computed: {
    ...mapState("busRoute", {
      cityOptions: "cityOptions",
    }),
    selectedCity: {
      get() {
        return this.$store.state.routeSelector.searchCity;
      },
      set(v) {
        this.$store.commit("routeSelector/setSearchCity", v);
      },
    },
    inputKeyword: {
      get() {
        return this.$store.state.routeSelector.searchKeyword;
      },
      set(v) {
        this.$store.commit("routeSelector/setSearchKeyword", v);
      },
    },
    searchIconSrc() {
      if (this.active) {
        return require("../assets/icons/search-dark-icon.svg");
      } else {
        return require("../assets/icons/search-white-icon.svg");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  max-width: 650px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background: #252e4f;
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  position: relative;

  &.active {
    background: #ffffff;
    border-radius: 0.5rem 0.5rem 0 0;
  }

  & > * {
    flex-basis: 0;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
    align-content: center;
  }

  & .city-selector,
  & .search-btn {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }

  & .separator {
    flex: 0 0 0.75rem;
    width: 0.75rem;
    height: 1rem;
    border-right: 1px solid #fff;
  }

  &.active .separator {
    border-right: 1px solid #c3cbe4;
  }

  & .search-btn {
    cursor: pointer;
    padding: 0.5rem 1.25rem;
    align-self: center;
    align-content: center;
    & img {
      width: 1rem;
      height: 1rem;
    }
  }

  & select,
  & input,
  & input::placeholder {
    color: #fff;
  }

  &.active select,
  &.active input,
  &.active input::placeholder {
    color: #040d2e;
  }

  & input:focus,
  & select:focus {
    outline: none;
  }

  & select,
  & input {
    background: none;
    padding: 0 0.75rem;
    border: none;
  }

  & .suggestion-block {
    position: absolute;
    z-index: 5;
    flex: 1 1 100%;
    width: 100%;
    background: #fff;
    top: 100%;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: 0px 0.25rem 1rem rgb(228 231 240 / 80%);

    &:before {
      content: "";
      display: block;
      width: calc(100% - 1.5rem);
      height: 1px;
      background: #c3cbe4;
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
