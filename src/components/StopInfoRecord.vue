<template>
  <div class="stop-info-record row">
    <div class="stop-sequence col-1 hide-mobile">
      {{ stopInfo.stopSequence }}
    </div>
    <div class="arrival-time col-3">
      <ArrivalTimeTag :arrivalInfo="arrivalInfo" />
    </div>
    <div class="stop-name col">{{ stopInfo.stopName }}</div>
    <div class="plate-number col-auto">
      <BusPlate
        :city="selectedRoute.city"
        :plateNumbers="arrivalInfo.plateNumbers || []"
      />
    </div>
    <div
      class="bus-line col-1"
      :class="{
        'hide-line': index === 0,
        active: arrivalInfo.plateNumbers.length !== 0,
      }"
    ></div>
  </div>
</template>

<script>
import BusPlate from "@/components/BusPlate.vue";
import ArrivalTimeTag from "@/components/ArrivalTimeTag.vue";

export default {
  name: "StopInfoRecord",
  props: {
    index: {
      type: Number,
      required: true,
    },
    selectedRoute: {
      type: Object,
      required: true,
    },
    stopInfo: {
      type: Object,
      required: true,
    },
    arrivalInfo: {
      type: Object,
      required: true,
    },
  },
  components: {
    BusPlate,
    ArrivalTimeTag,
  },
};
</script>

<style scoped lang="scss">
.stop-info-record {
  cursor: pointer;
  @media (min-width: 1025px) {
    &:hover {
      background: #f8f8fb;
    }
  }
  & .arrival-time {
    padding: 0.75rem 0;
  }

  & .stop-name {
    padding: 0.75rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
  }

  & .plate-number {
    padding: 0.75rem 0;
    white-space: nowrap;
    overflow: visible;
    text-align: right;
  }

  & .bus-line {
    align-self: stretch;
    position: relative;

    &:after {
      content: "";
      background: #fff;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 0.25rem;
      height: 0.25rem;
      border-radius: 50%;
      border: 2px solid #cacfde;
      z-index: 2;
    }

    &.active:after {
      background: #00dcd1;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      border: 2px solid #fff;
      -webkit-box-shadow: 0 0 0 1px #00dcd1;
      box-shadow: 0 0 0 1px #00dcd1;
    }

    &:not(.hide-line):before {
      content: "";
      position: absolute;
      width: 2px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background: #cacfde;
      transform: translateY(-50%);
      z-index: 1;
    }
    &:not(.hide-line).active:before {
      background: linear-gradient(0deg, #cacfde 0%, #00dcd1 100%);
      background-size: 100% 200%;
      animation: gradient-vertical 1.5s ease infinite;
    }

    @keyframes gradient-vertical {
      0% {
        background-position: 0 200%;
      }
      50% {
        background-position: 0 100%;
      }
      100% {
        background-position: 0 0;
      }
    }
  }
}
</style>