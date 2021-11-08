<template>
  <div class="search-suggestion-input">
    <div class="option-btn" v-for="o in options" :key="o" @click="clickBtn(o)">
      <div class="option">{{ o }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchSuggestionInput",
  data() {
    return {
      options: [
        "紅",
        "綠",
        "橘",
        "藍",
        "棕",
        "黃",
        "F",
        "R",
        "T",
        "小",
        "幹線",
        "先導",
        "內科",
        "市民",
        "南軟",
        "貓空",
        "跳蛙",
        "夜間",
      ],
    };
  },
  methods: {
    clickBtn(value) {
      this.$emit("input");
      this.$store.commit("routeSelector/setSearchKeyword", value);
    },
  },
};
</script>

<style scoped lang="scss">
.search-suggestion-input {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;

  & > .option-btn {
    flex: 0 0 calc(100% / 9);
    max-width: calc(100% / 9);

    @media(max-width: 768px) {
      flex: 0 0 calc(100% / 6);
      max-width: calc(100% / 6);
    }

    @media(max-width: 576px) {
      flex: 0 0 calc(100% / 4);
      max-width: calc(100% / 4);
    }

    padding: 0.375rem;
    cursor: pointer;

    & > .option {
      border: 1px solid #8c90ab;
      border-radius: 1000px;
      padding: 0.5rem 0;
      white-space: nowrap;
      text-align: center;
      font-weight: 400;
      font-size: 0.875rem;
    }

    &:hover > .option {
      background: #f4f5f9;
    }
  }
}
</style>
