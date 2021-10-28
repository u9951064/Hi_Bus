<template>
  <div class="search-suggestion-input">
    <div class="option-btn" v-for="o in options" :key="o" @click="clickBtn(o)">
      <div class="option">{{ o }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchSuggestionInput',
  data() {
    return {
      options: [
        '紅', '綠', '橘', '藍', '棕', '黃', 'F', 'R', 'T', '小', '幹線', '先導', '內科', '市民', '南軟', '貓空', '跳蛙', '夜間', 
      ],
    }
  },
  methods: {
    clickBtn(value) {
      this.$emit('input', value);
    }
  },
}
</script>

<style scoped lang="scss">
.search-suggestion-input {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content:left;

  & .option-btn {
    padding: 0.3rem 0.5rem;
    flex: 0 0 20%;
    width: 20%;
    max-width: 20%;
    cursor: pointer;

    & .option {
      border: 1px solid #8C90AB;
      border-radius: 1000px;
      padding: 0.5rem 1rem;
      white-space: nowrap;
    }

    &:hover .option{
      background: #F4F5F9;
    }
  }

  
}
</style>
