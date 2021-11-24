<template>
  <div class="nearby-arrival">
    <div class="row nav" v-if="!!currentStation">
      <div class="back-btn" @click="goBack">
        <img src="../../assets/icons/back-icon.svg" />
      </div>
      <div class="col title text-left">
        {{ currentStation.stationName }}
        <span class="distance-tag"
          ><img src="../../assets/icons/bubble-black-icon.svg" />{{
            currentStation.distance
          }}m</span
        >
      </div>
    </div>
    <div class="table-header row hide-mobile">
      <div class="arrival-time">預估到站</div>
      <div class="route-content">公車路線/起始站與終點站</div>
      <div class="bus-favorite">收藏最愛</div>
    </div>
    <div class="table-body">
      <div
        class="row route-item"
        v-for="r in currentStationArrival"
        :key="r.subRouteUID"
        @click="tracingRoute(r)"
      >
        <div class="arrival-time">
          <ArrivalTimeTag :arrivalInfo="r" />
        </div>
        <div class="route-content">
          <div class="route-no">{{ r.subRouteName }}</div>
          <div class="route-name" v-html="replaceSymbol(r.headSign)"></div>
        </div>
        <div class="bus-favorite">
          <FavoriteBtn :route="r" />
        </div>
      </div>
    </div>
    <div class="process-bar">
      <ProgressCounter
        :nextUpdateTimestamp="nextUpdateTimestamp"
        @update="reloadArrival"
      />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters } from "vuex";
import ArrivalTimeTag from "@/components/ArrivalTimeTag.vue";
import ProgressCounter from "@/components/ProgressCounter.vue";
import FavoriteBtn from "@/components/FavoriteBtn.vue";
import replaceSymbol from "@/utils/replaceSymbol";

const initialHandler = async () => {
  if (!store.getters["nearbyStop/currentStation"]) {
    return {
      name: "NearbyStations",
    };
  }
  return null;
};

export default {
  name: "NearbyArrivalList",
  beforeRouteEnter: initialHandler,
  beforeRouteUpdate: initialHandler,
  data() {
    return {
      nextUpdateTimestamp: new Date().getTime(),
      updateArrivalGap: 15000,
    };
  },
  components: {
    ArrivalTimeTag,
    ProgressCounter,
    FavoriteBtn,
  },
  methods: {
    goBack() {
      this.$store.commit("nearbyStop/setupFocusStation", "");
      return this.$router.back();
    },
    replaceSymbol(text) {
      return replaceSymbol(text);
    },
    tracingRoute(route) {
      this.$router.push({
        name: "TracingBus",
        params: {
          uniqueIndex: route.uniqueIndex,
        },
        query: {
          direction: route.direction,
        },
      });
    },
    reloadArrival() {
      if (!this.currentStation) {
        return;
      }
      store.dispatch("nearbyStop/updateArrival");
      this.nextUpdateTimestamp = new Date().getTime() + this.updateArrivalGap;
    },
  },
  computed: {
    ...mapGetters("nearbyStop", {
      currentStation: "currentStation",
      currentStationArrival: "currentStationArrival",
    }),
  },
};
</script>

<style scoped lang="scss">
.nearby-arrival {
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 1.5rem 2.5rem;
  @media (max-width: 767px) {
    padding: 1rem 0.75rem 0.25rem;
  }

  & > .nav {
    flex: 0 0 auto;
    max-height: 100%;
    padding-bottom: 0.5rem;

    & > .title {
      font-size: 1.5rem;
      @media (max-width: 768px) {
        font-size: 1.125rem;
      }
      letter-spacing: 0.02em;
      color: #040d2e;
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    & > .back-btn {
      cursor: pointer;
      flex: 0 0 auto;
      max-width: 100%;
      text-align: center;
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #fff;

      & > img {
        height: 0.75rem;
      }

      @media (max-width: 1023px) {
        display: none;
      }
    }
  }

  & > .table-header {
    flex: 0 0 auto;
    max-height: 100%;
    border-bottom: 1px solid #cacfde;
    padding: 0.5rem 1rem 0.5rem 0;
    font-size: 0.875rem;
    color: #8c90ab;
    white-space: nowrap;
  }

  & > .table-body {
    flex-basis: 0;
    flex-grow: 1;
    max-height: 100%;
    overflow: auto;

    & > .route-item {
      border-bottom: 1px solid #cacfde;
      font-size: 0.75rem;
      color: #040d2e;
      white-space: nowrap;
      padding: 0.5rem 1rem 0.5rem 0;
      @media (max-width: 768px) {
        padding: 0.5rem 0;
      }

      @media (min-width: 1025px) {
        &:hover {
          background-color: #f8f8fb;
          cursor: pointer;
        }
      }
    }
  }

  & > .process-bar {
    flex: 0 0 auto;
  }

  & .arrival-time {
    flex: 0 0 25%;
    overflow: hidden;
  }

  & .route-content {
    flex-basis: 0;
    flex-grow: 1;
    padding: 0 0.5rem;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;

    & > .route-no {
      width: 100%;
      font-size: 1.125rem;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & > .route-name {
      width: 100%;
      font-size: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  & .bus-favorite {
    text-align: left;
    flex: 0 0 calc(7rem + 0.75rem + 0.75rem);
    max-width: calc(7rem + 0.75rem + 0.75rem);
    padding-left: 0.75rem;
    padding-right: 0.75rem;

    @media (max-width: 767px) {
      flex: 0 0 3rem;
      max-width: 3rem;
      padding-right: 0;
    }
  }

  & .distance-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0.375rem 0;
    border: 1px solid #cacfde;
    border-radius: 100rem;
    width: 4rem;
    color: #8c90ab;
    font-size: 0.75rem;
    font-weight: 300;

    & > img {
      height: 0.75rem;
      margin-right: 0.3rem;
    }
  }
}
</style>