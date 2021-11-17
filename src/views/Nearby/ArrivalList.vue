<template>
  <div class="nearby-arrival">
    <div class="row nav">
      <div class="col title text-left">{{ !currentStation ? '' : currentStation.stationName }}</div>
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
      >
        <div class="arrival-time">
          <ArrivalTimeTag :arrivalInfo="r" />
        </div>
        <div class="route-content">
          <div class="route-no">{{ r.subRouteName }}</div>
          <div class="route-name">{{ r.headSign }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters } from "vuex";
import ArrivalTimeTag from "@/components/ArrivalTimeTag";

const initialHandler = async (to, from, next) => {
  const stationName = String(to.params.stationName || "").trim();
  store.commit("nearbyStop/setupFocusStation", stationName);
  if (!store.getters["nearbyStop/currentStation"]) {
    next({
      name: "NearbyStations",
    });
  } else {
    next();
  }
};

export default {
  name: "NearbyArrivalList",
  beforeRouteEnter: initialHandler,
  beforeRouteUpdate: initialHandler,
  components: {
    ArrivalTimeTag,
  },
  methods: {},
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

    & > .title {
      font-size: 1.5rem;
      @media (max-width: 768px) {
        font-size: 1.125rem;
      }
      letter-spacing: 0.02em;
      color: #040d2e;
      font-weight: bold;

      & span {
        color: #8c90ab;
        font-size: 0.75rem;
        font-weight: 300;
      }
    }
  }

  & > .table-header {
    flex: 0 0 auto;
    max-height: 100%;
    border-bottom: 1px solid #cacfde;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    color: #8c90ab;
    white-space: nowrap;
  }

  & > .table-body {
    flex-basis: 0;
    flex-grow: 1;
    max-height: 100%;
    overflow: auto;

    & > .station-item {
      border-bottom: 1px solid #cacfde;
      font-size: 0.75rem;
      color: #040d2e;
      white-space: nowrap;
      padding: 0.5rem 1rem;
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

  & .station-content {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    & > .station-name {
      flex: 0 0 75%;
      overflow: hidden;
      font-size: 1.5rem;

      @media (max-width: 767px) {
        flex: 0 0 100%;
        font-size: 1.25rem;
      }
    }

    & > .station-count {
      flex: 0 0 25%;
      overflow: hidden;
      font-size: 0.75rem;

      @media (max-width: 767px) {
        flex: 0 0 100%;
        text-align: left;
      }
    }
  }

  & .station-name {
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }

  & .station-count {
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
  }

  & .station-distance {
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    flex: 0 0 5.5rem;
  }

  & .distance-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0.375rem 0;
    border: 1px solid #cacfde;
    border-radius: 100rem;
    width: 5.2rem;
  }
}
</style>