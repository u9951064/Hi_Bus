<template>
  <div class="progress-counter">
    <div class="col-auto text-center">{{ updateRemiderLabel }}</div>
    <div class="col-auto text-right">更新</div>
    <div class="progress col-12" :class="{animated: updateRemiderTime >= 300}" ref="progressBar"></div>
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
    window.addEventListener('focus', this.setupTimer, false);
    window.addEventListener('blur', this.releaseTimer, false);
  },
  beforeUnmount() {
    window.removeEventListener('focus', this.setupTimer, false);
    window.removeEventListener('blur', this.releaseTimer, false);
    this.releaseTimer();
  },
  methods: {
    setupTimer() {
      if(this.timer) {
        return;
      }
      this.timer = setInterval(() => {
        this.currentTime = new Date().getTime();
        if(this.updateRemiderTime < 1) {
          this.$emit('update');
        }
      }, 1000);
    },
    releaseTimer() {
      if(!this.timer) {
        return;
      }
      clearInterval(this.timer);
      this.timer = 0;
    }
  },
  computed: {
    updateRemiderTime() {
      return Math.max(this.nextUpdateTimestamp, this.currentTime) - this.currentTime;
    },
    updateRemiderLabel() {
      if(this.updateRemiderTime < 300) {
        return '更新中...';
      }
      return Math.round(this.updateRemiderTime * 1e-3) + '秒後更新';
    },
  },
};
</script>

<style scoped lang="scss">
.progress-counter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  max-width: 15rem;
  justify-content: space-between;

  & .progress{
  position: relative;
  height: 2px;
  width: 100%;
  background-color: #00DCD1;

  &.animated:before {
      content: '';
      position: absolute;
      background-color: #CACFDE;
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
};
</style>