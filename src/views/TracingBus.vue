<template>
  <div class="tracing-page">
    <div class="" v-for="o in stops" :key="o.stopUID">
      {{ o.stopName }}
      {{ getArrivalInfo(o.stopUID).estimateTime }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";

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
    await store.dispatch("busStop/loadBusStop", routeItems[0]),
    store.dispatch("busStop/updateArrivalBus", routeItems[0]),
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
  beforeRouteEnter: initialHandler,
  beforeRouteUpdate: initialHandler,
  methods: {
    getArrivalInfo(stopUID) {
      return (
        this.arrivalInfos[stopUID] || {
          stopUID,
          estimateTime: Number.MAX_SAFE_INTEGER,
          stopStatus: 1,
          plateNumbers: [],
        }
      );
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

