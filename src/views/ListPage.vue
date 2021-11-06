<template>
  <div class="list-page">
    <div class="container result-block">
      <div class="result-info">
        <span class="result-string">
          <template v-if="isFavoritePage">已收藏</template>
          <template v-else>共找到</template>
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
          <div class="table-row">
            <div class="bus-info-block">
              <div class="bus-number">公車路線</div>
              <div class="bus-headsign">起始站與終點站</div>
            </div>
            <div class="bus-favorite">收藏最愛</div>
          </div>
        </div>
        <div class="table-content" ref="scoller">
          <div class="city-group" v-for="(c, i) in searchResults" :key="i">
            <div class="city-name" :ref="c.city">{{ c.cityName }}</div>
            <div
              class="table-row pointer"
              v-for="r in c.routes"
              :key="r.uniqueIndex"
              @click="goTracing(r)"
            >
              <div class="bus-info-block">
                <div
                  class="bus-number"
                  v-html="replaceSymbol(r.subRouteName)"
                ></div>
                <div
                  class="bus-headsign"
                  v-html="replaceSymbol(r.headSign)"
                ></div>
              </div>
              <div class="bus-favorite">
                <FavoriteBtn :route="r" />
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
    isFavoritePage: {
      type: Boolean,
      required: false,
      default: false,
    },
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
    justify-content: stretch;
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
    }
  }

  & .table-row,
  & .bus-info-block {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    & > * {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      text-align: left;
    }

    & > .bus-favorite {
      text-align: center;
      flex: 0 0 calc(7rem + 0.75rem + 0.75rem);
      max-width: calc(7rem + 0.75rem + 0.75rem);
      padding-left: 0.75rem;
      padding-right: 0.75rem;

      @media (max-width: 768px) {
        flex: 0 0 3rem;
        max-width: 3rem;
        padding-right: 0;
      }
    }

    & > .bus-number {
      flex: 0 0 25%;
      max-width: 25%;
      padding-left: 1.5rem;
      padding-right: 0.75rem;
      @media (max-width: 768px) {
        flex: 1 1 100%;
        max-width: 100%;
        padding-left: 0;
        padding-right: 0;
      }
    }

    & > .bus-headsign {
      padding-left: 1.5rem;
      padding-right: 0.75rem;
      @media (max-width: 768px) {
        flex: 1 1 100%;
        max-width: 100%;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  & .table-content,
  & .table-header {
    padding: 0.75rem 3.25rem;
    @media (max-width: 768px) {
      padding: 0.75rem 1.25rem;
    }
  }

  & .table-header {
    color: #8c90ab;
    font-size: 0.875rem;
    border-bottom: 1px solid #cacfde;
    @media (max-width: 768px) {
      display: none;
    }
  }

  & .table-content {
    overflow-y: scroll;
    & .table-row {
      font-size: 1rem;
      letter-spacing: 0.05em;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e7e9f2;

      &:hover {
        background: #f8f8fb;
      }

      & .bus-number {
        font-weight: bold;
      }
    }
  }

  & .city-name {
    text-align: left;
    color: #5468ff;
    font-weight: 700;
    font-size: 0.75rem;
    padding: 1.25rem 1.5rem 0;
    @media (max-width: 768px) {
      padding: 1.25rem 0 0;
    }
  }

  & .result-info {
    padding: 1.5rem 0;
    white-space: nowrap;
    overflow-y: auto;
    font-size: 0.875rem;

    & .result-string {
      padding-right: 1rem;
      @media(max-width: 768px) {
        padding-left: 1.25rem;
        padding-right: 0.75rem;
      }
    }
    

    & .result-count {
      font-weight: 700;
      color: #5468ff;
    }

    & .tag {
      cursor: pointer;
      margin-right: 1rem;
      padding: 0.5rem 1.25rem;
      background-color: #fff;
      color: #5468ff;
      border: 1px solid #5468ff;
      border-radius: 1000px;

      @media (max-width: 768px) {
        margin-right: 0.5rem;
      }

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
</style>
