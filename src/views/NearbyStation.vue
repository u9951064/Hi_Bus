<template>
  <div class="nearby-stops">
  </div>
</template>

<script>
const initialHandler = async (to, from, next) => {
  window.navigator.geolocation.getCurrentPosition();
  next();
};

export default {
  name: "NearbyStops",
  components: {
  },
  beforeRouteEnter: initialHandler,
  beforeRouteUpdate: initialHandler,
  data() {
    return {
      collapseOpen: true,
    };
  },
  methods: {
    changeCollapse(state) {
      this.collapseOpen = !!state;
    },
  },
  computed: {
  },
};
</script>

<style scoped lang="scss">
.nearby-page {
}
</style>