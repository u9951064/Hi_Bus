<template>
  <router-view />
</template>

<style lang="scss">
@import "~normalize.css/normalize.css";

html,
body {
  width: 100%;
  height: 100%;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  font-weight: normal;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  width: 100%;
  height: 100%;
}

.app .container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
}

.app .row:not(.direction-column) {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  &.flex-warp {
    flex-wrap: wrap;
  }

  & > .col {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }

  & > .col-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }

  @for $i from 1 through 12 {
    & > .col-#{$i} {
      flex: 0 0 calc($i / 12 * 100%);
      max-width: calc($i / 12 * 100%);
    }
  }

  &.direction-column {
    flex-direction: column;

    & > .col {
      flex-basis: 0;
      flex-grow: 1;
      max-height: 100%;
    }

    & > .col-auto {
      flex: 0 0 auto;
      height: auto;
      max-height: 100%;
    }

    @for $i from 1 through 12 {
      & > .col-#{$i} {
        flex: 0 0 calc($i / 12 * 100%);
        max-height: calc($i / 12 * 100%);
      }
    }
  }
}

.app .row.direction-column {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  &.flex-warp {
    flex-wrap: wrap;
  }

  & > .col {
    flex-basis: 0;
    flex-grow: 1;
    max-height: 100%;
  }

  & > .col-auto {
    flex: 0 0 auto;
    height: auto;
    max-height: 100%;
  }

  @for $i from 1 through 12 {
    & > .col-#{$i} {
      flex: 0 0 calc($i / 12 * 100%);
      max-height: calc($i / 12 * 100%);
    }
  }
}

.app .text-right {
  text-align: right;
}

.app .text-center {
  text-align: center;
}

.app .text-left {
  text-align: left;
}

.app .pointer {
  cursor: pointer;
}
</style>
