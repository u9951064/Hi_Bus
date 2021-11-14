<template>
  <div
    class="arrival-time-tag"
    :class="tagAttr.class"
    v-html="tagAttr.label"
  ></div>
</template>

<script>
const nearbyThreshold = 60;

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
    return "進站中";
  }
  return timestampOffset <= 60
    ? `${
        Math.floor(timestampOffset / 10) * 10
      } <span style="font-size:0.725rem;font-weight:400;">秒</span>`
    : `${Math.floor(
        timestampOffset / 60
      )} <span style="font-size:0.725rem;font-weight:400;">分</span>`;
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
          result.label = "未營運";
          break;
        case "3":
          result.label = "末班駛離";
          break;
        case "2":
          result.label = "不停靠";
          break;
        case "1":
          result.label = generateTimeAtString(this.estimateTime);
          result.class =
            result.label === "尚未發車" ? "status-empty" : "status-estimate";
          break;
        case "0":
          result.label = generateCountDownString(this.estimateTime);
          result.class =
            result.label === "進站中" ? "status-nearby" : "status-estimate";
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
  border-radius: 100rem;
  width: 6rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    width: 5rem;
  }

  &.status-empty {
    color: #8c90ab;
    background: #fff;
    border: 1px solid #cacfde;
    font-size: 0.875rem;
  }

  &.status-nearby {
    color: #fff;
    background: #ff6464;
    border: 1px solid #ff6464;
    font-size: 0.875rem;
  }

  &.status-estimate {
    font-weight: bold;
    color: #040d2e;
    background: #f8f8fb;
    border: 1px solid #8c90ab;
    font-size: 1.125rem;
  }
}
</style>