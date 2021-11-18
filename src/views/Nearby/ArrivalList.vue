<template>
  <div class="nearby-arrival">
    <div class="row nav" v-if="!!currentStation">
      <div class="col title text-left">
        {{ currentStation.stationName }}
        <span class="distance-tag"
          ><img src="../../assets/icons/bubble-orange-icon.svg" />{{
            currentStation.distance
          }}m</span
        >
      </div>
      <!-- <div class="col-auto pointer" @click="updatePosition">
        <img src="../../assets/icons/reload-icon.svg" alt="更新" />
      </div> -->
    </div>
    <div class="table-header row hide-mobile">
      <div class="arrival-time">預估到站</div>
      <div class="route-content">公車路線/起始站與終點站</div>
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
import ArrivalTimeTag from "@/components/ArrivalTimeTag";
import ProgressCounter from "@/components/ProgressCounter";
import replaceSymbol from "@/utils/replaceSymbol";

const initialHandler = async (to) => {
  const stationName = String(to.params.stationName || "").trim();
  store.commit("nearbyStop/setupFocusStation", stationName);
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
  },
  methods: {
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
      font-size: 1.125rem;
      font-weight: 700;
    }

    & > .route-name {
      font-size: 1rem;
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