<template>
  <a
    class="favorite-btn"
    :class="{ active: isFavorite }"
    @click.stop="toggleStatus"
  >
    <span class="label">{{ label }}</span>
  </a>
</template>

<script>
export default {
  name: "FavoriteBtn",
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  methods: {
    toggleStatus() {
      this.$store.commit("favoritePool/toggle", this.route);
    },
  },
  computed: {
    isFavorite() {
      return this.$store.getters["favoritePool/isFavorite"](
        this.route.city,
        this.route.uniqueIndex
      );
    },
    label() {
      return this.isFavorite ? "已收藏" : "收藏";
    },
  },
};
</script>

<style scoped lang="scss">
.favorite-btn {
  cursor: pointer;
  padding: 0.5rem 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  white-space: nowrap;
  color: #8c90ab;
  font-size: 0.875rem;
  & .label {
    display: none;
  }
  &:before {
    content: "";
    width: 1.125rem;
    height: 1.125rem;
    background-size: cover;
    display: inline-block;
    background-image: url("../assets/icons/favorite-empty-icon.svg");
  }

  &.active:before {
    background-image: url("../assets/icons/favorite-green-icon.svg");
  }
}

// 768px 以上
@media (min-width: 768px) {
  .favorite-btn {
    border-radius: 1000rem;
    border: 1px solid #cacfde;
    padding: 0.5rem 0;
    width: 6rem;

    & .label {
      display: inline;
      margin-left: 0.2rem;
    }

    &:before {
      width: 0.75rem;
      height: 0.75rem;
    }

    &:hover {
      background-color: #f4f5f9;
    }

    &:active {
      background-color: #bbc5e4;
      color: #fff;

      &:before {
        background-image: url("../assets/icons/favorite-white-icon.svg");
      }
    }

    &.active,
    &.active:active,
    &.active:hover {
      background: #00dcd1;
      color: #fff;

      &:before {
        background-image: url("../assets/icons/favorite-white-icon.svg");
      }
    }
  }
}
</style>
