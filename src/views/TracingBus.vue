<template>
  <div class="tracing-page">
    <div class="bus-info-block row direction-column">
      <div class="nav row col-auto">
        <div class="back-btn col-auto" @click="backToResult">
          <img src="../assets/icons/arrow-gray.svg" />
        </div>
        <div class="col-auto text-right">
          <div class="refresh-info row flex-warp">
            <div class="col-auto text-center">10秒後更新</div>
            <div class="col-auto text-right">更新</div>
            <progress class="col-12" max="100" value="32"></progress>
          </div>
        </div>
      </div>
      <div class="route-header row col-auto">
        <div class="route-number col-auto">
          {{ selectedRoute.subRouteName }}
        </div>
        <div class="head-sign col">{{ selectedRoute.headSign }}</div>
        <div class="favorite col-auto">
          <img src="../assets/icons/favorite-empty-icon.svg" />收藏
        </div>
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
        <div class="col-3">預估到站</div>
        <div class="col">站名</div>
        <div class="col-4">車牌號碼及位置</div>
      </div>
      <div class="stop-list col">
        <template
          v-for="(o, i) in stops"
          :key="selectedRoute.subRouteUID + '-' + o.stopUID"
        >
          <div v-if="i > 0" class="divider"></div>
          <div class="stop-item row">
            <div class="arrival-time col-3">
              <div>{{ getEstimateTimeLabel(getArrivalInfo(o.stopUID)) }}</div>
            </div>
            <div class="stop-name col">{{ o.stopName }}</div>
            <div class="plate-number col-3">
              <BusPlate :city="selectedRoute.city" :plateNumbers="getArrivalInfo(o.stopUID).plateNumbers || []"/>
            </div>
            <div class="bus-line col-1" :class="{active: getArrivalInfo(o.stopUID).plateNumbers.length !== 0}"></div>
          </div>
        </template>
      </div>
    </div>
    <div class="bus-map-block"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";
import BusPlate from '@/components/BusPlate.vue'

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
  data() {
    return {
      reloadTimmer: null,
    };
  },
  components: {
    BusPlate
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
    getEstimateTimeLabel(arrivalInfo) {
      switch (`${arrivalInfo.stopStatus}`) {
        case "4":
          return "今日未營運";
        case "3":
          return "末班車已過";
        case "2":
          return "交管不停靠";
        case "1":
          if (arrivalInfo.estimateTime === Number.MAX_SAFE_INTEGER) {
            return "尚未發車";
          } else {
            return ((timestampOffset) => {
              timestampOffset =
                timestampOffset === Number.MAX_SAFE_INTEGER
                  ? 0
                  : timestampOffset;
              const estimateTime = new Date(
                new Date().getTime() + timestampOffset * 1e3
              );
              const hourString = `${
                estimateTime.getHours() < 10 ? "0" : ""
              }${estimateTime.getHours()}`;
              const minuteString = `${
                estimateTime.getMinutes() < 10 ? "0" : ""
              }${estimateTime.getMinutes()}`;
              return `${hourString} : ${minuteString}`;
            })(arrivalInfo.estimateTime || Number.MAX_SAFE_INTEGER);
          }
        case "0":
          if (arrivalInfo.estimateTime === Number.MAX_SAFE_INTEGER) {
            return "尚未發車";
          } else {
            return ((timestampOffset) => {
              timestampOffset =
                timestampOffset === Number.MAX_SAFE_INTEGER
                  ? 0
                  : timestampOffset;
              if (timestampOffset < 15) {
                return "即將進站";
              }
              if (timestampOffset <= 60) {
                return `${timestampOffset} 秒`;
              }
              return `${Math.floor(timestampOffset / 60)} 分`;
            })(arrivalInfo.estimateTime || Number.MAX_SAFE_INTEGER);
          }
        default:
          return "更新中";
      }
    },
    selectDirection(route) {
      this.$store.commit("routeSelector/setSelectedRoute", route);
    },
  },
  computed: {
    ...mapState("routeSelector", {
      selectedRoute: "selectedRoute",
    }),
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

  & .favorite {
    border-radius: 1000rem;
    border: 1px solid #cacfde;
    color: #8c90ab;
    font-size: 0.9rem;
    padding: 0.5rem 1.5rem;
  }

  & .back-btn {
    padding: 0.75rem;
    cursor: pointer;
    & img {
      width: 1.5rem;
      transform: scaleX(-1);
    }
    &:hover {
      background-color: #d1dcff;
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

    & .stop-item {
    }

    & .divider {
      background: #edeef2;
      height: 1px;
      width: calc(100% * 11 / 12);
    }

    & .arrival-time {
      padding: 0.75rem 0;
      & > * {
        display: inline-block;
        padding: 0.5rem;
        color: #09182d;
        background: #f4f5f9;
        border: 1px solid #8c90ab;
        border-radius: 9999rem;
        width: 7rem;
      }
    }

    & .stop-name {
      padding: 0.75rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
    }

    & .plate-number {
      padding: 0.75rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-align: right;
    }

    & .bus-line {
      align-self: stretch;
      position: relative;

      &:after {
        content: "";
        background: #fff;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        border: 2px solid #cacfde;
        z-index: 2;
      }

      &.active:after {
        background: #00dcd1;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        border: 2px solid #fff;
        -webkit-box-shadow: 0 0 0 1px #00dcd1;
        box-shadow: 0 0 0 1px #00dcd1;
      }
    }

    & .divider ~ .stop-item {
      & .bus-line {
        &:before {
          content: "";
          position: absolute;
          width: 2px;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          background: #cacfde;
          transform: translateY(-50%);
          z-index: 1;
        }
        &.active:before {
          background: linear-gradient(180deg, #cacfde 0%, #00dcd1 100%);
        }
      }
    }
  }
}
</style>