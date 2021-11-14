<template>
  <div class="bus-plate" v-if="plateCount !== 0">
    <img class="plate-bus" src="../assets/icons/bus-icon.svg" />
    <img
      v-if="isFraternity"
      class="plate-fraternity"
      src="../assets/icons/fraternity-icon.svg"
    />
    <span>{{ firstPlate }}</span>
  </div>
</template>

<script>
export default {
  name: "BusPlate",
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
      if (this.plateNumbers.length === 0) {
        return;
      }
      this.$store.dispatch("vehicleInfo/loadVehicles", {
        city: this.city,
        plateNumbers: this.plateNumbers,
      });
    },
  },
  computed: {
    plateCount() {
      return this.plateNumbers.length;
    },
    firstPlate() {
      return this.plateNumbers[0] || "";
    },
    busVehicleInfo() {
      if (!this.firstPlate) {
        return null;
      }
      return (
        this.$store.state.vehicleInfo.busVehicleMap[this.firstPlate] || null
      );
    },
    isFraternity() {
      if (!this.busVehicleInfo || !("vehicleType" in this.busVehicleInfo)) {
        return false;
      }
      return this.busVehicleInfo.vehicleType === 1;
    },
  },
};
</script>

<style scoped lang="scss">
.bus-plate {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 100rem;
  background: #fff;
  border: 1px solid #cacfde;
  color: #8c90ab;
  font-weight: 300;
  font-size: 0.75rem;
  letter-spacing: 0.08em;

  @media (max-width: 768px) {
    padding: 0.25rem;
    font-size: 0.75rem;
    letter-spacing: 0.02em;
  }

  & > * ~ * {
    margin-left: 0.25rem;
  }
}
</style>
