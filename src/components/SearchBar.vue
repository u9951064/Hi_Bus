<template>
  <div class="search" :class="{ active: active, 'home-search': atHomePage }">
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
  props: {
    atHomePage: {
      type: Boolean,
      required: false,
      default: false,
    },
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
      if (this.atHomePage || this.active) {
        return require("../assets/icons/search-purple-icon.svg");
      } else {
        return require("../assets/icons/search-white-icon.svg");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
  background: #252E4F;
  position: relative;
  font-size: 0.875rem;
  border: 1px solid #252E4F;
  color: #FFF;

  & > .city-selector {
    border: none;
    flex: 0 0 auto;
    width: auto;
    border: 0;
    outline: none;
    background-color: transparent;
    color: #FFF;
    padding: 0.5rem 0 0.5rem 1.5rem;
  }

  & > .separator {
    flex: 0 0 0;
    width: 0;
    height: 1rem;
    padding-left: 0.875rem;
    border-right: 1px solid #fff;
  }

  & > .keyword-input {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    color: #FFF;
    padding: 0.5rem 0 0.5rem 0.875rem;

    &::placeholder {
      color: #FFF;
    }
  }

  & > .search-btn {
    cursor: pointer;
    border: none;
    flex: 0 0 auto;
    width: auto;
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 0 1.25rem 0 0.25rem;
  }

  & > .suggestion-block {
    position: absolute;
    display: none;
    top: 100%;
    left: -1px;
    right: -1px;
    max-height: 45vh;
    flex: 1 1 100%;
    padding: 0 1.25rem 1.25rem;
    overflow-y: auto;

    @media(max-width: 768px) {
      max-height: 60vh;
    }

    &:before {
      content: '';
      display: block;
      width: 100%;
      margin: auto;
      border-top: 1px solid #CACFDE;
      height: 1.25rem;
    }
  }

  &.home-search, & > .suggestion-block, &.active {
    color: #040D2E;
    background: #FFF;
    border: 1px solid #5468FF;

    & > .keyword-input, & > .city-selector {
      color: #8C90AB;
      &::placeholder {
        color: #8C90AB;
      }
    }

    & > .separator {
      border-color: #8C90AB;
    }
  }

  &.active {
    border-bottom-color: transparent;
    border-radius: 0.375rem 0.375rem 0 0;

    & > .suggestion-block {
      display: block;
      border-top: none;
      border-radius: 0 0 0.375rem 0.375rem;
    }
  }
}
</style>
