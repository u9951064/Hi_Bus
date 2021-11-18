<template>
  <div class="nearby-stop-map" :data-c="watchCenter" :data-s="watchStops">
    <div class="map-container" ref="hereMap"></div>
  </div>
</template>

<script>
import { markRaw } from "@vue/reactivity";
import { apiKey } from "@/configs/HereMapConfig";

export default {
  name: "NearbyStopMap",
  props: {
    centerPoint: {
      type: Object,
      required: true,
    },
    busStations: {
      type: Array,
      required: true,
    },
    focusBusStation: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      initialized: false,
      mapObject: markRaw({
        platform: null,
        map: null,
        layer: null,
        centerGroup: null,
        stopGroup: null,
      }),
      currentData: markRaw({
        currentPoint: null,
        busStations: null,
        focusBusStation: null,
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
          center: this.centerPoint,
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

      this.mapObject.centerGroup = new H.map.Group();
      this.mapObject.stopGroup = new H.map.Group();
      this.mapObject.map.addObject(this.mapObject.centerGroup);
      this.mapObject.map.addObject(this.mapObject.stopGroup);

      // this.mapObject.stopGroup.addEventListener("tap", (evt) => {
      //   this.openInfoBox(evt.target.getData());
      // });

      this.$nextTick(() => {
        this.initialized = true;
      });
    },
    drawCenterMarker() {
      this.mapObject.centerGroup.removeAll();
      const H = window.H;
      const markerDom = document.createElement("div");
      markerDom.innerHTML = `
        <div class="center-marker">
          <img src="${require("../assets/icons/map-center-icon.svg")}" />
        </div>
      `;
      const marker = new H.map.DomMarker(this.centerPoint, {
        icon: new H.map.DomIcon(markerDom),
        zIndex: 1,
      });
      this.mapObject.centerGroup.addObject(marker);
    },
    drawStopMarker(busStations) {
      this.mapObject.stopGroup.removeAll();
      if (busStations.length === 0) {
        return;
      }

      const H = window.H;
      const markers = busStations.map((s) => {
        const marker = document.createElement("div");
        marker.innerHTML = `
          <div class="stop-marker">
            <img src="${require("../assets/icons/bubble-orange-icon.svg")}" />
          </div>
        `;
        return new H.map.DomMarker(s.position, {
          icon: new H.map.DomIcon(marker),
          zIndex: 2,
          data: s,
        });
      });
      this.mapObject.stopGroup.addObjects(markers);
    },
    setCenter(lng, lat) {
      this.mapObject.map.setCenter({ lat, lng });
    },
    setupCenterPointData() {
      if (this.currentData.centerPoint == this.centerPoint) {
        return false;
      }
      this.currentData.centerPoint = this.centerPoint;
      return true;
    },
    setupBusStationsData() {
      if (this.currentData.busStations == this.busStations) {
        return false;
      }
      this.currentData.busStations = this.busStations;
      return true;
    },
  },
  computed: {
    watchCenter() {
      if (this.initialized && this.setupCenterPointData()) {
        this.drawCenterMarker();
      }
      return this.centerPoint;
    },
    watchStops() {
      if (this.initialized && this.setupBusStationsData()) {
        this.drawStopMarker(this.busStations);
        if (this.busStations.length > 0) {
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
      return this.busStations;
    },
  },
};
</script>

<style lang="scss">
.nearby-stop-map {
  width: 100%;
  height: 100%;

  & .map-container {
    width: 100%;
    height: 100%;
  }

  & .stop-marker {
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

  & .center-marker {
    margin: -50%;
    width: 8rem;
    & > img {
      width: 100%;
    }
  }
}
</style>