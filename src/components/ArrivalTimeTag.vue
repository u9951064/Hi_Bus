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
const generateTimeAtTag = function (timestampOffset) {
  if (timestampOffset === Number.MAX_SAFE_INTEGER) {
    return {
      class: "status-empty",
      label: "尚未發車",
    };
  }
  const estimateTime = new Date(new Date().getTime() + timestampOffset * 1e3);
  const hourString = `${
    estimateTime.getHours() < 10 ? "0" : ""
  }${estimateTime.getHours()}`;
  const minuteString = `${
    estimateTime.getMinutes() < 10 ? "0" : ""
  }${estimateTime.getMinutes()}`;

  return {
    class: "status-estimate",
    label: `${hourString} : ${minuteString}`,
  };
};

// 倒數時間 XX 分
const generateCountDownTag = function (timestampOffset) {
  timestampOffset =
    timestampOffset === Number.MAX_SAFE_INTEGER ? 0 : timestampOffset;
  if (timestampOffset <= nearbyThreshold) {
    return {
      class: "status-arrival",
      label: "進站中",
    };
  }

  if (timestampOffset <= 60) {
    return {
      class: "status-nearby",
      label: `${
        Math.floor(timestampOffset / 60) * 10
      } <span style="font-size:0.725rem;font-weight:400;padding-left:0.2rem">秒</span>`,
    };
  }

  if (timestampOffset <= 120) {
    return {
      class: "status-nearby",
      label: `${Math.floor(
        timestampOffset / 60
      )} <span style="font-size:0.725rem;font-weight:400;padding-left:0.2rem">分</span>`,
    };
  }

  return {
    class: "status-estimate",
    label: `${Math.floor(
      timestampOffset / 60
    )} <span style="font-size:0.725rem;font-weight:400;padding-left:0.2rem">分</span>`,
  };
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
          return generateTimeAtTag(this.estimateTime);
        case "0":
          return generateCountDownTag(this.estimateTime);
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
  padding: 0.6rem 0;
  border-radius: 100rem;
  width: 6rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    width: 5rem;
  }

  &.status-empty {
    color: #8c90ab;
    background: #f8f8fb;
    font-size: 0.875rem;
  }

  &.status-arrival {
    color: #fff;
    background: #ff6464;
    font-size: 0.875rem;
  }

  &.status-nearby {
    font-weight: bold;
    color: #ff6464;
    background: #ffe5e5;
    font-size: 1.125rem;
  }

  &.status-estimate {
    font-weight: bold;
    color: #040d2e;
    background: #e7e9f2;
    font-size: 1.125rem;
  }
}
</style>