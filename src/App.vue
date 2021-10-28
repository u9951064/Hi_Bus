<template>
  <router-view/>
</template>

<style>
@import "~normalize.css/normalize.css";

html,
body {
  width: 100%;
  height: 100%;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  font-weight: normal;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  width: 100%;
  height: 100%;
}

#app .container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
}
</style>
