<template>
  <div class="bus-tracing-map">
    <div
      class="map-container"
      ref="hereMap"
      :data-s="stops"
      :data-b="busPositions"
      :data-r="route"
    ></div>
    <div
      class="map-stop-info-container"
      style="display: none"
      ref="stopInfoBox"
    >
      <div class="map-info-box" v-if="!!activeStop">
        <a class="map-close-btn">
          <img src="../assets/icons/close-icon.svg" />
        </a>
        <div class="map-stop-name">{{ activeStop.stopName }}</div>
        <div class="map-info-inner">
          <div class="map-route-info">
            <div class="map-route-name" v-html="busRouteName"></div>
            <div class="map-head-sign" v-html="busHeadSign"></div>
          </div>
          <div class="map-arrival-tag">
            <ArrivalTimeTag :arrivalInfo="currentArrivalInfo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { markRaw } from "@vue/reactivity";
import { apiKey } from "@/configs/HereMapConfig";
import ArrivalTimeTag from "@/components/ArrivalTimeTag.vue";

export default {
  name: "BusTracingMap",
  components: {
    ArrivalTimeTag,
  },
  props: {
    busRouteName: {
      type: String,
      required: true,
    },
    busHeadSign: {
      type: String,
      required: true,
    },
    busStops: {
      type: Array,
      required: true,
    },
    arrivalInfos: {
      type: Object,
      required: true,
    },
    busRoute: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      initialized: false,
      activeStop: null,
      mapObject: markRaw({
        platform: null,
        map: null,
        layer: null,
        routePathGroup: null,
        stopGroup: null,
        busGroup: null,
        infoGroup: null,
      }),
      currentData: markRaw({
        busStops: null,
        arrivalInfos: null,
        busRoute: null,
      }),
    };
  },
  created() {
    const pixelRatio = window.devicePixelRatio || 1;
    this.mapObject.platform = new window.H.service.Platform({ apiKey });
    this.mapObject.layer = this.mapObject.platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320,
      lg: "CHT",
    });
  },
  mounted() {
    this.initializeHereMap();
  },
  methods: {
    initializeHereMap() {
      // rendering map
      const H = window.H;
      const map = new H.Map(
        this.$refs.hereMap,
        this.mapObject.layer.vector.normal.map,
        {
          layers: [
            this.mapObject.layer.vector.normal.map,
            this.mapObject.layer.raster.normal.map,
          ],
          zoom: 15,
          center: { lat: 25.0681944993822, lng: 121.397454504827 },
          pixelRatio: window.devicePixelRatio || 1,
        }
      );

      addEventListener("resize", () => map.getViewPort().resize());

      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      new H.ui.UI(map, {
        mapsettings: false,
        distancemeasurement: false,
        scalebar: {
          alignment: H.ui.LayoutAlignment.LEFT_BOTTOM,
        },
        zoom: {
          slider: false,
          sliderSnaps: false,
        },
      });

      this.mapObject.map = map;

      this.mapObject.routePathGroup = new H.map.Group();
      this.mapObject.stopGroup = new H.map.Group();
      this.mapObject.busGroup = new H.map.Group();
      this.mapObject.infoGroup = new H.map.Group();
      this.mapObject.map.addObject(this.mapObject.routePathGroup);
      this.mapObject.map.addObject(this.mapObject.stopGroup);
      this.mapObject.map.addObject(this.mapObject.busGroup);
      this.mapObject.map.addObject(this.mapObject.infoGroup);

      this.mapObject.busGroup.addEventListener("tap", (evt) => {
        this.openInfoBox(evt.target.getData());
      });
      this.mapObject.stopGroup.addEventListener("tap", (evt) => {
        this.openInfoBox(evt.target.getData());
      });

      this.$nextTick(() => {
        this.initialized = true;
      });
    },
    async drawBusRoutePath() {
      await this.$store.dispatch("busRouteShape/loadShape", this.busRoute);
      // 清除舊資料
      this.mapObject.routePathGroup.removeAll();
      // 取得經緯度資料
      const routeNodes = this.$store.state.busRouteShape.currentGeometry;
      if (routeNodes.length < 2) {
        return;
      }
      // 準備寫入資料
      const H = window.H;
      const pathPoints = new H.geo.LineString([]);
      routeNodes.forEach((n) => {
        pathPoints.pushPoint({
          lng: n[0],
          lat: n[1],
        });
      });
      const polyObject = new H.map.Polyline(pathPoints, {
        style: { lineWidth: 5, strokeColor: "#00DCD1" },
        zIndex: 1,
      });
      // 清除舊資料，寫入新資料
      this.mapObject.routePathGroup.addObject(polyObject);
    },
    drawStopMarker(stopObjects) {
      this.mapObject.stopGroup.removeAll();
      if (stopObjects.length === 0) {
        return;
      }

      const H = window.H;
      const markers = stopObjects.map((s) => {
        const marker = document.createElement("div");
        marker.innerHTML = `
          <div class="stop-marker">
            <img src="${require("../assets/icons/bus-stop-marker.svg")}" />
            <div>${s.stopSequence}</div>
          </div>
        `;
        return new H.map.DomMarker(
          {
            lat: s.stopPosition.positionLat,
            lng: s.stopPosition.positionLon,
          },
          {
            icon: new H.map.DomIcon(marker),
            zIndex: 2,
            data: s,
          }
        );
      });
      this.mapObject.stopGroup.addObjects(markers);
    },
    drawBusMarker(stopObjects) {
      this.mapObject.busGroup.removeAll();
      if (stopObjects.length === 0) {
        return;
      }

      const H = window.H;
      const markers = stopObjects.map((s) => {
        const marker = document.createElement("div");
        marker.innerHTML = `
          <div class="bus-marker">
            <img src="${require("../assets/icons/bus-icon.svg")}"/>
          </div>
        `;
        return new H.map.DomMarker(
          {
            lat: s.stopPosition.positionLat,
            lng: s.stopPosition.positionLon,
          },
          {
            icon: new H.map.DomIcon(marker),
            zIndex: 3,
            data: s,
          }
        );
      });
      this.mapObject.busGroup.addObjects(markers);

      this.$nextTick(() => {
        this.updateInfoBox();
      });
    },
    setCenter(lng, lat) {
      this.mapObject.map.setCenter({ lat, lng });
    },
    openInfoBox(stopInfo) {
      this.activeStop = stopInfo;
      this.$nextTick(() => {
        this.updateInfoBox();
        this.mapObject.map.getViewModel().setLookAtData(
          {
            zoom: this.mapObject.map.getZoom(),
            bounds: this.mapObject.infoGroup.getBoundingBox(),
          },
          true
        );
      });
    },
    hideInfoBox() {
      if (this.activeStop !== null) {
        this.activeStop = null;
        this.clearInfoBox();
      }
    },
    updateInfoBox() {
      if (this.activeStop === null) {
        return;
      }

      const H = window.H;
      const infoBlock = this.$refs.stopInfoBox.cloneNode(true);
      infoBlock.style.display = "";

      const closeMethod = () => {
        this.hideInfoBox();
      };

      const markObject = new H.map.DomMarker(
        {
          lat: this.activeStop.stopPosition.positionLat,
          lng: this.activeStop.stopPosition.positionLon,
        },
        {
          icon: new H.map.DomIcon(infoBlock, {
            onAttach: function (clonedElement) {
              const el = clonedElement.querySelector(".map-close-btn");
              el.addEventListener("click", closeMethod);
              el.addEventListener("touchstart", closeMethod);
            },
            // the function is called every time marker leaves the viewport
            onDetach: function (clonedElement) {
              const el = clonedElement.querySelector(".map-close-btn");
              el.removeEventListener("click", closeMethod);
              el.removeEventListener("touchstart", closeMethod);
            },
          }),
          zIndex: 4,
        }
      );
      this.clearInfoBox();
      this.mapObject.infoGroup.addObject(markObject);
    },
    clearInfoBox() {
      this.mapObject.infoGroup.removeAll();
    },
    setupCurrentRouteData() {
      if (this.currentData.busRoute == this.busRoute) {
        return false;
      }
      this.currentData.busRoute = this.busRoute;
      return true;
    },
    setupCurrentBusStopData() {
      if (this.currentData.busStops == this.busStops) {
        return false;
      }
      this.currentData.busStops = this.busStops;
      return true;
    },
    setupCurrentArrivalInfoData() {
      if (this.currentData.arrivalInfos == this.arrivalInfos) {
        return false;
      }
      this.currentData.arrivalInfos = this.arrivalInfos;
      return true;
    },
  },
  computed: {
    route() {
      if (this.initialized && this.setupCurrentRouteData()) {
        this.drawBusRoutePath();
      }
      return this.busRoute;
    },
    stops() {
      if (this.initialized && this.setupCurrentBusStopData()) {
        this.hideInfoBox();
        this.drawStopMarker(this.busStops);
        if (this.busStops.length > 0) {
          const rect = this.mapObject.stopGroup.getBoundingBox();
          this.mapObject.map.getViewModel().setLookAtData(
            {
              position: rect.getCenter(),
              bounds: rect,
            },
            true
          );
        }
      }
      return this.busStops;
    },
    busPositions() {
      const result = [];
      if (this.initialized && this.setupCurrentArrivalInfoData()) {
        this.stops.forEach((s) => {
          if (
            !this.arrivalInfos[s.stopUID] ||
            this.arrivalInfos[s.stopUID].plateNumbers.length === 0
          ) {
            return;
          }
          result.push(s);
        });
        this.drawBusMarker(result);
      }
      return result;
    },
    currentArrivalInfo() {
      return (
        this.arrivalInfos[this.activeStop.stopUID] || {
          stopUID: this.activeStop.stopUID,
          estimateTime: Number.MAX_SAFE_INTEGER,
          stopStatus: "1",
          plateNumbers: [],
        }
      );
    },
  },
};
</script>

<style lang="scss">
.bus-tracing-map {
  width: 100%;
  height: 100%;

  & .map-container {
    width: 100%;
    height: 100%;
  }

  & .stop-marker {
    cursor: pointer;
    position: relative;
    display: block;
    margin: -150% -50%;
    width: 2rem;
    & > img {
      width: 100%;
    }
    & > div {
      position: absolute;
      display: inline-block;
      top: 0.5rem;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      margin: auto;
      color: #fff;
      font-size: 0.675rem;
    }
  }

  & .bus-marker {
    cursor: pointer;
    position: relative;
    display: block;
    margin: -75% -50%;
    width: 1.25rem;
    & > img {
      width: 100%;
    }
  }

  & .map-info-box {
    position: relative;
    width: 20rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.97);
    border-radius: 0.5rem;
    text-align: left;
    margin: -55% -50%;
    box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: auto;
      border-style: solid;
      border-width: 0.5rem 0.5rem 0 0.5rem;
      width: 0;
      z-index: 5;
      border-color: #ffffff transparent transparent transparent;
      box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);
      opacity: 0.97;
    }

    & > .map-close-btn {
      cursor: pointer;
      position: absolute;
      display: block;
      width: 1rem;
      height: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 1rem;
      right: 1rem;
    }

    & > .map-stop-name {
      flex: 0 0 100%;
      max-width: 100%;
      color: #5468ff;
      font-size: 1.25rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & > .map-info-inner {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: center;
      align-items: flex-end;

      & > .map-route-info {
        flex-basis: 0;
        flex-grow: 1;
        max-height: 100%;
        overflow-x: hidden;

        & > .map-route-name {
          padding: 0.5rem 0 0.25rem;
          color: #040d2e;
          display: block;
          overflow: hidden;
          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        & > .map-head-sign {
          color: #040d2e;
          display: block;
          overflow: hidden;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      & > .map-arrival-tag {
        flex: 0 0 auto;
        width: auto;
        max-width: 100%;
      }
    }
  }
}
</style>