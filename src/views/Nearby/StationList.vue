<template>
  <div class="nearby-station-list">
    <div class="row nav">
      <div class="col title text-left">附近公車站牌 <span>500m內</span></div>
      <div class="col-auto pointer" :class="{loading: isGPSLoading}" @click="updatePosition">
        <img src="../../assets/icons/reload-icon.svg" alt="更新" />
      </div>
    </div>
    <div class="table-header row hide-mobile">
      <div class="station-content">
        <div class="station-name">站名</div>
        <div class="station-count">路線總數</div>
      </div>
      <div class="station-distance">距離</div>
    </div>
    <div class="table-body">
      <div
        class="row station-item pointer"
        v-for="s in nearbyStopList"
        :key="s.stationName"
        @click="selectStation(s.stationName)"
      >
        <div class="station-content">
          <div class="station-name">{{ s.stationName }}</div>
          <div class="station-count">{{ s.routeCount }} 條路線</div>
        </div>
        <div class="station-distance">
          <span class="distance-tag"
            ><img src="../../assets/icons/bubble-orange-icon.svg" /> {{
              s.distance
            }}m</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GPSStateConst from '@/constants/GPSStateConst';
import { mapGetters, mapState } from "vuex";

export default {
  name: "NearbyStationList",
  methods: {
    updatePosition() {
      if(!this.isGPSLoading) {
        this.$store.dispatch('nearbyStop/loadNearby');
      }
    },
    selectStation(stationName) {
      this.$store.commit("nearbyStop/setupFocusStation", stationName);
      this.$router.push({
        name: "NearbyArrivals",
        params: {
          stationName,
        },
      });
    },
  },
  computed: {
    ...mapState("nearbyStop", {
      GPSState: "GPSState",
    }),
    ...mapGetters("nearbyStop", {
      nearbyStopList: "getNearbyList",
    }),
    isGPSLoading() {
      return this.GPSState === GPSStateConst.LOADING;
    }
  },
};
</script>

<style scoped lang="scss">
.nearby-station-list {
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

      & span {
        color: #8c90ab;
        font-size: 0.75rem;
        font-weight: 300;
      }
    }

    & .loading > img {
      animation-name: loading-rotate;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    @keyframes loading-rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
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

      & > .station-content > .station-name {
        font-size: 1rem;
        @media (max-width: 767px) {
          font-size: 1.25rem;
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

      @media (max-width: 767px) {
        flex: 0 0 100%;
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