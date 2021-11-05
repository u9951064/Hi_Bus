<template>
  <div
    class="arrival-time-tag"
    :class="tagAttr.class"
    v-text="tagAttr.label"
  ></div>
</template>

<script>
const nearbyThreshold = 30;

// 預計時間 XX:XX
const generateTimeAtString = function (timestampOffset) {
  if (timestampOffset === Number.MAX_SAFE_INTEGER) {
    return "尚未發車";
  }
  const estimateTime = new Date(new Date().getTime() + timestampOffset * 1e3);
  const hourString = `${
    estimateTime.getHours() < 10 ? "0" : ""
  }${estimateTime.getHours()}`;
  const minuteString = `${
    estimateTime.getMinutes() < 10 ? "0" : ""
  }${estimateTime.getMinutes()}`;
  return `${hourString} : ${minuteString}`;
};

// 倒數時間 XX 分
const generateCountDownString = function (timestampOffset) {
  timestampOffset =
    timestampOffset === Number.MAX_SAFE_INTEGER ? 0 : timestampOffset;
  if (timestampOffset <= nearbyThreshold) {
    return "即將進站";
  }
  return timestampOffset <= 60
    ? `${Math.floor(timestampOffset / 10) * 10} 秒`
    : `${Math.floor(timestampOffset / 60)} 分`;
};

export default {
  name: "ArrivalTimeTag",
  props: {
    arrivalInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    stopStatus() {
      return String(this.arrivalInfo.stopStatus);
    },
    estimateTime() {
      return this.arrivalInfo.estimateTime || Number.MAX_SAFE_INTEGER;
    },
    tagAttr() {
      const result = {
        class: "status-empty",
        label: '更新中"',
      };

      switch (this.stopStatus) {
        case "4":
          result.label = "今日未營運";
          break;
        case "3":
          result.label = "今日未營運";
          break;
        case "2":
          result.label = "交管不停靠";
          break;
        case "1":
          result.label = generateTimeAtString(this.estimateTime);
          result.class =
            result.label === "尚未發車" ? "status-empty" : "status-estimate";
          break;
        case "0":
          result.label = generateCountDownString(this.estimateTime);
          result.class =
            result.label === "即將進站" ? "status-nearby" : "status-estimate";
          break;
        default:
          result.label = "更新中";
      }
      return result;
    },
  },
};
</script>

<style scoped lang="scss">
.arrival-time-tag {
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;
  color: #09182d;
  background: #ffffff;
  border: 1px solid #8c90ab;
  border-radius: 9999rem;
  width: 7rem;

  &.status-nearby {
    background: #ff6464;
    color: #ffffff;
    border: 1px solid #ff6464;
  }

  &.status-estimate {
    background: #f4f5f9;
  }
}
</style>