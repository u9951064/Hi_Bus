<template>
  <div class="progress-counter">
    <div class="countdown-status">{{ updateRemiderLabel }}</div>
    <div
      class="progress-bar"
      :class="{ animated: updateRemiderTime >= 300 }"
      ref="progressBar"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ProgressCounter",
  props: {
    nextUpdateTimestamp: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentTime: new Date().getTime(),
      timer: 0,
      activeStatus: true,
    };
  },
  mounted() {
    this.setupTimer();
    window.addEventListener("focus", this.setupTimer, false);
    window.addEventListener("blur", this.releaseTimer, false);
  },
  beforeUnmount() {
    window.removeEventListener("focus", this.setupTimer, false);
    window.removeEventListener("blur", this.releaseTimer, false);
    this.releaseTimer();
  },
  methods: {
    setupTimer() {
      if (this.timer) {
        return;
      }
      this.timer = setInterval(() => {
        this.currentTime = new Date().getTime();
        if (this.updateRemiderTime < 1) {
          this.$emit("update");
        }
      }, 1000);
    },
    releaseTimer() {
      if (!this.timer) {
        return;
      }
      clearInterval(this.timer);
      this.timer = 0;
    },
  },
  computed: {
    updateRemiderTime() {
      return (
        Math.max(this.nextUpdateTimestamp, this.currentTime) - this.currentTime
      );
    },
    updateRemiderLabel() {
      if (this.updateRemiderTime < 300) {
        return "更新中...";
      }
      return Math.round(this.updateRemiderTime * 1e-3) + "秒後更新";
    },
  },
};
</script>


<style scoped lang="scss">
.progress-counter {
  width: 100%;
  & > .countdown-status {
    width: 100%;
    padding: 0.5rem 0;
    text-align: right;
    font-size: 0.75rem;
    color: #8c90ab;
  }
  & > .progress-bar {
    position: relative;
    height: 2px;
    width: 100%;
    background-color: #00dcd1;

    &.animated:before {
      content: "";
      position: absolute;
      background-color: #cacfde;
      width: 0px;
      height: 2px;
      right: 0;
      animation-name: progres;
      animation-duration: 16s;
      animation-iteration-count: 1;
    }
  }
}

@keyframes progres {
  0% {
    width: 100%;
  }
  50% {
    width: 35%;
  }
  90% {
    width: 5%;
  }
  100% {
    width: 00%;
  }
} ;
</style>