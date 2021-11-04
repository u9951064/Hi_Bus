<template>
  <div class="list-page">
    <div class="container result-block">
      <div class="result-info">
        <span>共找到 {{resultCount}} 個公車路線</span>
        <span class="tag" v-for="c in cityList" :key="c.city">{{ c.cityName }}</span>
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
          <div class="table-container">
            <div class="city-group" v-for="(c, i) in searchResults" :key="i">
              <div class="city-name">{{ c.cityName }}</div>
              <div class="table-row pointer" v-for="r in c.routes" :key="r.uniqueIndex" @click="goTrading(r)">
                <div class="bus-number">{{ r.subRouteName }}</div>
                <div class="bus-headsign">{{ r.headSign }}</div>
                <div class="bus-favorite">
                  <FavoriteBtn :route="r"/>
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
import FavoriteBtn from '@/components/FavoriteBtn.vue'

export default {
  name: 'ListPage',
  props: {
    records: {
      type: Object,
      required: true,
    }
  },
  components: {
    FavoriteBtn
  },
  methods: {
    goTrading(route) {
      return this.$router.push({
        name: 'TracingBus',
        params: {
          uniqueIndex: route.uniqueIndex,
        }
      });
    }
  },
  computed: {
    // searchResults() {
    //   const r = this.$store.getters['busRoute/searchRoutes'](
    //     this.$store.state.routeSelector.selectedCity,
    //     this.$store.state.routeSelector.inputKeyword
    //   );
    //   return Object.values(records).filter(r => r.routes.length !== 0);
    // },
    searchResults() {
      return Object.values(this.records).filter(r => r.routes.length !== 0);
    },
    resultCount() {
      return this.searchResults.reduce((c, d) => c += d.routes.length, 0);
    },
    cityList() {
      return this.searchResults
        .map(d => {
          return {
            cityName: d.cityName,
            city: d.city,
          };
        });
    },
  }
}
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
    background: #F7F7FA;
  }

  & .city-name {
    text-align: left;
    padding: 1rem 0.5rem 0.5rem;
    color: #5468FF;
  }

  & .result-info {
    padding: 1.5rem 0;

    & .tag {
      margin: 0 0.25rem;
      padding: 0.5rem 1.25rem;
      background-color: #FFF;
      color: #5468FF;
      border: 1px solid #5468FF;
      border-radius: 1000px;
    }
  }
}
</style>
