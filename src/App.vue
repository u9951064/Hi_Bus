<template>
  <router-view />
</template>

<style lang="scss">
@import "~normalize.css/normalize.css";
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&family=Noto+Sans+TC:wght@300;500&display=swap&subset=latin");
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;500;700&display=swap&subset=chinese-traditional");

html,
body {
  width: 100%;
  height: 100%;
  font-family: "Montserrat", "Noto Sans TC";
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

@media (max-width: 768px) {
  .app .hide-mobile {
    display: none !important;
  }
}

.app .name-arrow-icon {
  display: inline-block;
  padding: 0 0.5rem 0.125rem;
}
.app span.search-highlight {
  color: #5468FF !important;
}
</style>
