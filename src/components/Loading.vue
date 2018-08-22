<template>
  <div class="loading">
    <img src="./../assets/loading-spinning-bubbles.svg" alt="">
  </div>
</template>
<style>
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 121;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .loading img {
    margin: 25% auto;
  }
</style>
<script>
  export default {
    data() {
      return {}
    },
    methods: {}
  }
</script>
