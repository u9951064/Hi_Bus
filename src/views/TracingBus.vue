<template>
  <div class="tracing-page">
    <div class="bus-info-block row direction-column">
      <div class="nav row col-auto">
        <div class="back-btn col-auto">
          <a class="link" @click="backToResult">
            <img src="../assets/icons/arrow-dark.svg" />
          </a>
        </div>
        <div class="col-4 text-right">
          <ProgressCounter
            :nextUpdateTimestamp="nextUpdateTimestamp"
            @update="reloadArrival"
          />
        </div>
      </div>
      <div class="route-header col-auto">
        <div class="row">
          <div class="route-number col">
            {{ selectedRoute.subRouteName }}
          </div>
          <div class="col-auto">
            <FavoriteBtn :route="selectedRoute" />
          </div>
        </div>
        <div class="head-sign">{{ selectedRoute.headSign }}</div>
      </div>
      <div class="route-directions row col-auto" v-if="routeGroup.length > 1">
        <div
          class="direction-item col"
          v-for="r in routeGroup"
          :key="r.subRouteUID + '-' + r.direction"
          :class="{ active: selectedRoute.subRouteUID == r.subRouteUID }"
          @click="selectDirection(r)"
        >
          {{ getDriectionLabel(r) }}
        </div>
      </div>
      <div class="stop-header row col-auto">
        <div class="col-1">站序</div>
        <div class="col-3">預估到站</div>
        <div class="col">站名</div>
        <div class="col-4">車牌號碼及位置</div>
      </div>
      <div class="stop-list col">
        <template
          v-for="(o, i) in stops"
          :key="selectedRoute.subRouteUID + '-' + o.stopUID"
        >
          <div v-if="i !== 0" class="divider"></div>
          <StopInfoRecord
            :index="i"
            :selectedRoute="selectedRoute"
            :stopInfo="o"
            :arrivalInfo="getArrivalInfo(o.stopUID)"
            @click="focusStop(o.stopPosition)"
          />
        </template>
      </div>
    </div>
    <div class="bus-map-block">
      <!-- <keep-alive> -->
      <HereMap :busStops="stops" ref="busMap" />
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";
import HereMap from "@/components/HereMap.vue";
import FavoriteBtn from "@/components/FavoriteBtn.vue";
import StopInfoRecord from "@/components/StopInfoRecord.vue";
import ProgressCounter from "@/components/ProgressCounter.vue";

const initialHandler = async (to, from, next) => {
  const uniqueIndex = String(to.params.uniqueIndex || "").trim();
  const routeItems =
    uniqueIndex === ""
      ? []
      : store.getters["busRoute/getRouteGroup"](uniqueIndex);
  if (routeItems.length === 0) {
    store.commit("routeSelector/setSelectedRoute", null);
    next({
      name: "SearchResult",
      query: {
        city: store.state.routeSelector.selectedCity,
        keyword: store.state.routeSelector.inputKeyword,
      },
    });
  } else {
    store.commit("routeSelector/setSelectedRoute", routeItems[0]);
    await store.dispatch("busStop/loadBusStop", routeItems[0]);
    store.dispatch("busStop/updateArrivalBus", routeItems[0]);
    next();
  }
};

export default {
  name: "TracingBus",
  components: {
    HereMap,
    FavoriteBtn,
    StopInfoRecord,
    ProgressCounter,
  },
  beforeRouteEnter: initialHandler,
  beforeRouteUpdate: initialHandler,
  methods: {
    getArrivalInfo(stopUID) {
      return (
        this.arrivalInfos[stopUID] || {
          stopUID,
          estimateTime: Number.MAX_SAFE_INTEGER,
          stopStatus: "1",
          plateNumbers: [],
        }
      );
    },
    backToResult() {
      return this.$router.push({
        name: "SearchResult",
        query: {
          city: this.$store.state.routeSelector.selectedCity,
          keyword: this.$store.state.routeSelector.inputKeyword,
        },
      });
    },
    getDriectionLabel(route) {
      const stops = this.$store.getters["busStop/getStops"](route);
      if (stops.length !== 0) {
        return `往 ${stops[stops.length - 1].stopName}`;
      }
      if (route.direction == "0") {
        return "去程";
      }
      if (route.direction == "1") {
        return "返程";
      }
      if (route.direction == "2") {
        return "迴圈路線";
      }
      return "其他路線";
    },
    selectDirection(route) {
      this.$store.commit("routeSelector/setSelectedRoute", route);
    },
    focusStop(position) {
      this.$refs.busMap.setCenter(position.positionLon, position.positionLat);
    },
    reloadArrival() {
      if (!this.selectedRoute) {
        return;
      }
      store.dispatch("busStop/updateArrivalBus", this.selectedRoute);
    },
  },
  computed: {
    ...mapState("routeSelector", {
      selectedRoute: "selectedRoute",
    }),
    nextUpdateTimestamp() {
      if (!this.selectedRoute) {
        return Number.POSITIVE_INFINITY;
      }
      return this.$store.getters["busStop/getNextUpdateTimestamp"](
        this.selectedRoute.uniqueIndex
      );
    },
    stops() {
      return this.$store.getters["busStop/getStops"](this.selectedRoute);
    },
    arrivalInfos() {
      return this.$store.getters["busStop/getStopInfos"](this.selectedRoute);
    },
    routeGroup() {
      if (!this.selectedRoute) {
        return [];
      }
      return this.$store.getters["busRoute/getRouteGroup"](
        this.selectedRoute.uniqueIndex
      );
    },
    routeDirections() {
      return this.routeGroup.map((r) => r.direction);
    },
  },
};
</script>

<style scoped lang="scss">
.tracing-page {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-items: stretch;
  align-items: stretch;
  height: 100%;
  padding: 1.5rem 1.5rem 0;

  & .nav {
    justify-content: space-between;
  }

  & .refresh-info {
    max-width: 15rem;
    justify-content: space-between;
  }

  & .route-number {
    text-align: left;
    font-weight: 600;
    font-size: 1.5rem;
  }

  & .head-sign {
    text-align: left;
    font-weight: 400;
    font-size: 1rem;
  }

  & .back-btn {
    & .link {
      display: inline-flex;
      padding: 0.75rem 0;
      cursor: pointer;
      border-radius: 100rem;
      &:hover {
        background-color: #f4f5f9;
      }
      &:active {
        color: #fff;
        background-color: #8c90ab;
      }
    }
    & img {
      width: 1.25rem;
      height: 1.25rem;
      transform: scaleX(-1);
    }
  }

  & .route-directions {
    margin: 0.5rem 0;
    background: #ffffff;
    color: #5468ff;
    border: 1px solid #5468ff;
    border-radius: 0.5rem;

    & :first-child {
      border-radius: 0.5rem 0 0 0.5rem;
    }

    & :last-child {
      border-radius: 0 0.5rem 0.5rem 0;
    }

    & .direction-item {
      padding: 0.5rem;
      cursor: pointer;
    }

    & .active {
      color: #ffffff;
      background: #5468ff;
      cursor: initial;
    }
  }

  & .bus-info-block,
  & .bus-map-block {
    flex: 1 1 50%;
    width: 50%;
    max-width: 50%;
    & > * {
      width: 100%;
    }
  }

  & .bus-info-block {
    background: #fff;
    border-radius: 0.5rem;
    padding: 1.5rem 3rem;
    box-shadow: 0px 4px 20px rgba(228, 231, 240, 0.8);
  }

  & .stop-header {
    color: #8c90ab;
    padding: 0.5rem 0;
    border-bottom: 1px solid #cacfde;
  }

  & .stop-list {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    & .divider {
      background: #edeef2;
      height: 1px;
      width: calc(100% * 11 / 12);
    }
  }
}
</style>