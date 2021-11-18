<template>
  <div class="tracing-page" :class="{ open: collapseOpen }">
    <div class="bus-info-block" :class="{ open: collapseOpen }">
      <div class="mobile-control-bar">
        <div v-if="collapseOpen" class="back-btn" @click="goBack">
          <img src="../assets/icons/back-icon.svg" />
        </div>
        <div
          v-if="collapseOpen"
          class="show-map-btn"
          @click="changeCollapse(false)"
        >
          <span>顯示地圖</span>
        </div>
      </div>

      <div class="route-header">
        <div class="route-number" v-html="busRouteName"></div>
        <div class="favorite-btn">
          <FavoriteBtn :route="selectedRoute" />
        </div>
        <div
          class="route-head-sign"
          :class="{ 'hide-mobile': !collapseOpen }"
          v-html="busHeadSign"
        ></div>
      </div>
      <div class="route-directions" v-if="routeGroup.length > 1">
        <div
          class="direction-item"
          v-for="r in routeGroup"
          :key="r.subRouteUID"
          :class="{ active: selectedRoute.subRouteUID == r.subRouteUID }"
          @click="selectDirection(r)"
        >
          {{ getDriectionLabel(r) }}
        </div>
      </div>
      <div class="stop-header row hide-mobile">
        <div class="col-1 text-center hide-mobile">站序</div>
        <div class="col-3 text-center">預估到站</div>
        <div class="col text-left">站名</div>
        <div class="col-auto text-right">車牌號碼及位置</div>
      </div>
      <div class="stop-list">
        <template
          v-for="(o, i) in stops"
          :key="selectedRoute.subRouteUID + '-' + o.stopUID"
        >
          <StopInfoRecord
            :index="i"
            :selectedRoute="selectedRoute"
            :stopInfo="o"
            :arrivalInfo="getArrivalInfo(o.stopUID)"
            @click="focusStop(o)"
          />
          <div class="divider"></div>
        </template>
      </div>
      <div class="nav">
        <div class="process-bar" v-show="collapseOpen">
          <ProgressCounter
            :nextUpdateTimestamp="nextUpdateTimestamp"
            @update="reloadArrival"
          />
        </div>
      </div>
    </div>
    <div class="bus-map-block">
      <template v-if="!collapseOpen">
        <div class="back-btn" @click="goBack">
          <img src="../assets/icons/back-icon.svg" />
        </div>
        <div class="toggle-map-btn" @click="changeCollapse(true)">
          <span>關閉地圖</span>
        </div>
      </template>

      <!-- <keep-alive> -->
      <BusTracingMap
        :busStops="stops"
        :arrivalInfos="arrivalInfos"
        :busRouteName="busRouteName"
        :busHeadSign="busHeadSign"
        :busRoute="selectedRoute"
        ref="busMap"
      />
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";
import replaceSymbol from "@/utils/replaceSymbol";
import BusTracingMap from "@/components/BusTracingMap.vue";
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
    const direction = "direction" in to.query ? `${to.query.direction}` : null;
    const routeItem =
      routeItems.find((r) => r.direction == direction) || routeItems[0];
    store.commit("routeSelector/setSelectedRoute", routeItem);
    await store.dispatch("busStop/loadBusStop", routeItem);
    store.dispatch("busStop/updateArrivalBus", routeItem);
    next();
  }
};

export default {
  name: "TracingBus",
  components: {
    BusTracingMap,
    FavoriteBtn,
    StopInfoRecord,
    ProgressCounter,
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
    goBack() {
      return this.$router.back();
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
    focusStop(stopInfo) {
      this.$refs.busMap.openInfoBox(stopInfo);
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
    busHeadSign() {
      if (!this.selectedRoute) {
        return "";
      }
      return replaceSymbol(this.selectedRoute.headSign);
    },
    busRouteName() {
      if (!this.selectedRoute) {
        return "";
      }
      return replaceSymbol(this.selectedRoute.subRouteName);
    },
  },
};
</script>

<style scoped lang="scss">
.tracing-page {
  @media (max-width: 1025px) {
    position: relative;

    & > .bus-info-block {
      position: absolute;
      z-index: 5;
      bottom: 0;
      right: 0;
      left: 0;
      height: 40%;
      background: #fff;
      box-shadow: 0px -6px 20px rgba(228, 231, 240, 0.8);
      overflow-y: hidden;
      transition-property: height;
      transition-duration: 0.15s;
      transition-timing-function: ease-in-out;
      &.open {
        height: 100%;
      }

      & > .mobile-control-bar {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        & > .collapse-btn {
          flex: 0 0 100%;
          max-width: 100%;
          text-align: center;
        }

        & > .back-btn,
        & > .show-map-btn {
          flex: 0 0 auto;
          max-width: 100%;
          text-align: center;
        }

        & > .back-btn {
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
        }

        & > .show-map-btn span {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          border: 1px solid #cacfde;
          border-radius: 1000rem;
          font-size: 0.875rem;
          color: #8c90ab;
        }
      }
    }

    & > .bus-map-block {
      position: absolute;
      z-index: 4;
      top: 0;
      right: 0;
      left: 0;
      height: 60%;

      & > .back-btn {
        position: absolute;
        z-index: 5;
        top: 0.875rem;
        left: 0.875rem;
        width: 2rem;
        height: 2rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: #fff;
        border: 1px solid #cacfde;

        & > img {
          height: 0.75rem;
        }
      }

      & > .toggle-map-btn span {
        position: absolute;
        z-index: 5;
        top: 0.875rem;
        right: 0.5rem;
        display: inline-block;
        padding: 0.375rem 0.875rem;
        border: 1px solid #cacfde;
        border-radius: 1000rem;
        font-size: 0.875rem;
        color: #8c90ab;
        background: #fff;
      }
    }

    &.collapse-open > .bus-info-block {
      height: 100%;
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

    & > .bus-info-block {
      flex: 0 0 50%;
      max-width: 50%;
      background: #fff;
      border-radius: 6px 0 0 6px;
      border-right: 1px solid #cacfde;
      overflow-y: hidden;
      box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);

      & > .mobile-control-bar {
        display: none;
      }
    }

    & > .bus-map-block {
      flex: 0 0 50%;
      max-width: 50%;
      background: #fff;
      border-radius: 0 6px 6px 0;
      overflow-y: hidden;
      box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);
    }
  }

  & > .bus-info-block {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 1.5rem 2.5rem;

    @media (max-width: 1025px) {
      padding: 0.5rem 0.5rem 0;
    }

    & > .nav {
      flex: 0 0 auto;
      max-height: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      flex-direction: row;
      align-items: center;

      & > .process-bar {
        flex: 0 0 100%;
        max-width: 100%;
        padding: 0;
        @media (max-width: 1025px) {
          padding: 0rem 1rem 0.5rem 1rem;
        }
      }
    }

    & > .route-header {
      flex: 0 0 auto;
      max-height: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.5rem;

      & > .route-number {
        flex-basis: 0;
        flex-grow: 1;
        max-width: 100%;
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-align: left;
      }

      & > .favorite-btn {
        flex: 0 0 auto;
        max-width: 100%;
      }

      & > .route-head-sign {
        flex: 0 0 100%;
        max-width: 100%;
        font-size: 1rem;
        text-align: left;
      }
    }

    & > .route-directions {
      flex: 0 0 auto;
      max-height: 100%;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: center;
      align-items: stretch;
      padding-bottom: 0.25rem;

      & > .direction-item {
        cursor: pointer;
        flex-basis: 0;
        flex-grow: 1;
        max-width: 100%;
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        padding: 0.5rem 0;
        border: 1px solid #5468ff;
        color: #5468ff;
        &:first-of-type {
          border-radius: 0.375rem 0 0 0.375rem;
        }
        &:last-of-type {
          border-radius: 0 0.375rem 0.375rem 0;
        }
        &.active {
          cursor: initial;
          color: #fff;
          background: #5468ff;
        }

        @media(max-width: 767px) {
          font-size: 0.875rem;
          padding: 0.5rem 0;
        }
      }
    }

    & > .stop-header {
      flex: 0 0 auto;
      max-height: 100%;
      border-bottom: 1px solid #cacfde;
      color: #8c90ab;
      font-size: 0.875rem;
      padding: 0.5rem 0;
    }

    & > .stop-list {
      flex-basis: 0;
      flex-grow: 1;
      max-height: 100%;
      overflow-y: scroll;

      & > .divider {
        width: calc(100% / 12 * 11);
        border-bottom: 1px solid #e7e9f2;
      }
    }
  }
}
</style>