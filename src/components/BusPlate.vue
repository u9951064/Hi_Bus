<template>
  <div class="bus-plate" v-if="plateCount !== 0">
    <img src="../assets/icons/bus-icon.svg" />
    <img v-if="isFraternity" src="../assets/icons/fraternity-icon.svg" />
    <span>{{ firstPlate }}</span>
  </div>
</template>

<script>
export default {
  name: 'BusPlate',
  props: {
    city: {
      type: String,
      required: true,
    },
    plateNumbers: {
      type: Array,
      required: true,
    },
  },
  beforeMount() {
    this.loadVehicles();
  },
  beforeUpdate() {
    //this.loadVehicles();
  },
  methods: {
    loadVehicles() {
      if(this.plateNumbers.length === 0) {
        return;
      }
      this.$store.dispatch('vehicleInfo/loadVehicles', {
        city: this.city,
        plateNumbers: this.plateNumbers,
      });
    }
  },
  computed: {
    plateCount() {
      return this.plateNumbers.length;
    },
    firstPlate() {
      return this.plateNumbers[0] || '';
    },
    busVehicleInfo() {
      if(!this.firstPlate) {
        return null;
      }
      return this.$store.state.vehicleInfo.busVehicleMap[this.firstPlate] || null;
    },
    isFraternity() {
      if(!this.busVehicleInfo || !('vehicleType' in this.busVehicleInfo)) {
        return false;
      }
      return this.busVehicleInfo.vehicleType === 1;
    }
  }
}
</script>

<style scoped lang="scss">
.bus-plate {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 100rem;
  border: 1px solid #CACFDE;
  white-space: nowrap;
  color: #8C90AB;
  background: #FFF;
  font-size: 0.75rem;
  justify-content: center;
  align-items: center;
}
</style>
