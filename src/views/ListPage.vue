<template>
  <div class="list-page">
    <div class="container result-block">
      <div class="result-info">
        <span
          >共找到
          <span class="result-count">{{ resultCount }}</span> 個公車路線</span
        >
        <a
          class="tag"
          v-for="c in cityList"
          :key="c.city"
          @click="scrollToCity(c.city)"
          >{{ c.cityName }}</a
        >
      </div>
      <div class="result-table">
        <div class="table-header">
          <div class="table-container">
            <div class="table-row">
              <div class="bus-number">公車路線</div>
              <div class="bus-headsign">起始站與終點站</div>
              <div class="bus-favorite">收藏最愛</div>
            </div>
          </div>
        </div>
        <div class="table-content">
          <div class="table-container" ref="scoller">
            <div class="city-group" v-for="(c, i) in searchResults" :key="i">
              <div class="city-name" :ref="c.city">{{ c.cityName }}</div>
              <div
                class="table-row pointer"
                v-for="r in c.routes"
                :key="r.uniqueIndex"
                @click="goTracing(r)"
              >
                <div
                  class="bus-number"
                  v-html="replaceSymbol(r.subRouteName)"
                ></div>
                <div
                  class="bus-headsign"
                  v-html="replaceSymbol(r.headSign)"
                ></div>
                <div class="bus-favorite">
                  <FavoriteBtn :route="r" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import replaceSymbol from "@/utils/replaceSymbol";
import FavoriteBtn from "@/components/FavoriteBtn.vue";

export default {
  name: "ListPage",
  props: {
    records: {
      type: Object,
      required: true,
    },
  },
  components: {
    FavoriteBtn,
  },
  methods: {
    replaceSymbol(text) {
      return replaceSymbol(text);
    },
    goTracing(route) {
      return this.$router.push({
        name: "TracingBus",
        params: {
          uniqueIndex: route.uniqueIndex,
        },
      });
    },
    scrollToCity(city) {
      this.$refs[city].scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  computed: {
    searchResults() {
      return Object.values(this.records).filter((r) => r.routes.length !== 0);
    },
    resultCount() {
      return this.searchResults.reduce((c, d) => (c += d.routes.length), 0);
    },
    cityList() {
      return this.searchResults.map((d) => {
        return {
          cityName: d.cityName,
          city: d.city,
        };
      });
    },
  },
};
</script>

<style scoped lang="scss">
.list-page {
  padding-bottom: 0.75rem;

  & .result-block {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-items: stretch;
    align-items: stretch;
    height: 100%;

    & > * {
      flex-basis: 0;
      flex-grow: 1;
      max-height: 100%;
      align-content: left;
      text-align: left;
    }

    & > .result-info {
      flex: 0 0 auto;
      height: auto;
      max-height: 100%;
    }
  }

  & .result-table {
    background-color: #fff;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-items: stretch;
    align-items: stretch;
    height: 100%;
    padding-bottom: 1rem;
    box-shadow: 0px 0.25rem 0.5rem rgb(228 231 240 / 80%);

    & > * {
      flex-basis: 0;
      flex-grow: 1;
      max-height: 100%;
      align-content: center;
      text-align: center;
    }

    & > .table-header {
      flex: 0 0 auto;
      height: auto;
      max-height: 100%;
      border-bottom: 1px solid #edeef2;
      padding: 0.25rem 0;
    }

    & .table-container {
      max-width: 1100px;
      width: 100%;
      margin: auto;
    }

    & .table-content {
      overflow: hidden;
    }
    & .table-content > .table-container {
      overflow-y: auto;
      max-height: 100%;
    }
  }

  & .table-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-items: center;
    align-items: center;

    & > * {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      padding: 0.5rem;
      text-align: left;
    }

    & > .bus-number {
      flex: 1 1 30%;
      width: 30%;
      max-width: 30%;
      font-weight: bold;
    }

    & > .bus-favorite {
      flex: 0 0 auto;
      width: auto;
    }

    & ~ .table-row {
      border-top: 1px solid #edeef2;
    }
  }

  & .table-content .table-row:hover {
    background: #f7f7fa;
  }

  & .city-name {
    text-align: left;
    padding: 1rem 0.5rem 0.5rem;
    color: #5468ff;
  }

  & .result-info {
    padding: 1.5rem 0;
    white-space: nowrap;
    overflow-y: auto;

    & .result-count {
      color: #5468ff;
    }

    & .tag {
      cursor: pointer;
      margin: 0 0.25rem;
      padding: 0.5rem 1.25rem;
      background-color: #fff;
      color: #5468ff;
      border: 1px solid #5468ff;
      border-radius: 1000px;

      &:hover {
        background: #e7e9fd;
      }

      &:active {
        color: #ffffff;
        background: #5468ff;
      }
    }
  }
}

@media (max-width: 768px) {
  .list-page {
    & .table-header {
      display: none;
    }

    & .table-row {
      justify-content: space-between;
      flex-wrap: wrap;

      & .bus-number {
        flex-basis: 0;
        flex-grow: 1;
        max-width: 100%;
      }

      & .bus-headsign {
        order: 3;
        flex: 1 1 100%;
        width: 100%;
      }
      
      & .bus-favorite {
        order: 2;
      }
    }

    
  }
}
</style>
