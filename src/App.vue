<template>
  <div id="app">
    <router-view></router-view>
    <Loading v-if="LoadingState"></Loading>
  </div>
</template>

<script>
  import Loading from './components/Loading';
  import {mapState} from 'vuex';

  export default {
    name: 'app',
    // computed: mapState({
    //   LoadingState: state => state.loadingState,
    // }),
    computed:{
      LoadingState(){
        return this.$store.state.loadingState
      }
    },
    components: {
      Loading
    }
  }
</script>

<style>
  .left {
    width: 20%;
    border: 1px solid gray;
    float: left;
  }
</style>
