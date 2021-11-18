<template>
  <div class="nearby-layout">
    <div class="nearby-info">
      <router-view />
    </div>
    <div class="nearby-map">
      <NearbyStopMap :centerPoint="currentGPS" :busStations="nearbyStopList" />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters, mapState } from "vuex";
import NearbyStopMap from '@/components/NearbyStopMap.vue';

const initialHandler = async (to, from, next) => {
  await store.dispatch("nearbyStop/loadNearby");
  next();
};

export default {
  name: "NearbyLayout",
  components: {
    NearbyStopMap,
  },
  beforeRouteEnter: initialHandler,
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapState("nearbyStop", {
      currentGPS: "geolocation",
    }),
    ...mapGetters("nearbyStop", {
      nearbyStopList: "getNearbyList",
    }),
  },
};
</script>

<style scoped lang="scss">
.nearby-layout {
  position: relative;

  @media (max-width: 1025px) {
    position: relative;

    & > .nearby-info {
      position: absolute;
      z-index: 5;
      bottom: 0;
      right: 0;
      left: 0;
      height: 45%;
      background: #fff;
      box-shadow: 0px -6px 20px rgba(228, 231, 240, 0.8);
      overflow-y: hidden;
      transition-property: height;
      transition-duration: 0.15s;
      transition-timing-function: ease-in-out;
    }

    & > .nearby-map {
      position: absolute;
      z-index: 4;
      top: 0;
      right: 0;
      left: 0;
      height: 60%;
    }
  }

  @media (min-width: 1025px) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-items: stretch;
    align-items: stretch;
    height: 100%;
    padding: 0.75rem;

    & > .nearby-info {
      flex: 0 0 50%;
      max-width: 50%;
      background: #fff;
      border-radius: 6px 0 0 6px;
      border-right: 1px solid #cacfde;
      overflow-y: hidden;
      box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);
    }

    & > .nearby-map {
      flex: 0 0 50%;
      max-width: 50%;
      background: #fff;
      border-radius: 0 6px 6px 0;
      overflow-y: hidden;
      box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);
    }
  }
}
</style>