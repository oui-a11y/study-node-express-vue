<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default" :class="{cur:defaultFlag}" @click="sortGoods('default')">Default</a>
          <a href="javascript:void(0)" :class="{'sort-up':sortFlag}" class="price" @click="sortGoods()">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}"
                     @click="setPriceFilter('all')">All</a></dd>
              <dd v-for="(item,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked== index}">{{item.startPrice}}
                  - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="30">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <model v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录,否则无法加入到购物车中!
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
      </div>
    </model>
    <model v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </model>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from './../components/NavHeader';
  import NavFooter from './../components/NavFooter';
  import NavBread from './../components/NavBread';
  import Model from './../components/Modal';
  import axios from 'axios'

  export default {
    data() {
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,
        loading: false,
        mdShow: false,
        mdShowCart: false,
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ],
        priceChecked: 'all',
        filterBy: false,
        overLayFlag: false,
        priceData: {
          startPrice: '-1',
          endPrice: '-1'
        },
        defaultFlag:true
      }
    },
    mounted() {
      var that = this;
      that.getGoodsList();
      that.pro();
    },
    methods: {
      pro(){
        var that = this;
        var param = {
          page: that.page,
          pageSize: that.pageSize,
          sort: that.sortFlag ? 1 : -1,
          startPrice: that.priceData.startPrice,
          endPrice: that.priceData.endPrice
        };

        that.$getAjax('/goods/list',param).then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      },
      getGoodsList(flag) {
        var that = this;
        var param = {
          page: that.page,
          pageSize: that.pageSize,
          sort: that.sortFlag ? 1 : -1,
          startPrice: that.priceData.startPrice,
          endPrice: that.priceData.endPrice
        };
        that.loading = true;
        axios.get('/goods/list', {params: param}).then((response) => {
          let res = response.data;
          that.loading = false;
          if (res.status == '0') {
            if (flag) {
              that.goodsList = that.goodsList.concat(res.result.data);
              if (res.result.count == 0) {
                that.busy = true;
              } else {
                that.busy = false;
              }
            } else {
              that.goodsList = res.result.data;
              that.busy = false;
            }
          } else {
            that.goodsList = [];
          }
        })
      },
      setPriceFilter(index) {
        var that = this;
        if (index == 'all') {
          that.priceChecked = 'all';
          that.priceData.startPrice = '-1';
          that.priceData.endPrice = '-1';
        } else {
          that.priceChecked = index;
          that.page = 1;
          that.priceData.startPrice = that.priceFilter[index].startPrice;
          that.priceData.endPrice = that.priceFilter[index].endPrice;
        }
        that.getGoodsList();
      },
      loadMore() {
        var that = this;
        that.busy = true;
        setTimeout(() => {
          that.page++;
          that.getGoodsList(true);
        }, 500);
      },
      sortGoods(flag) {
        var that = this;
        if (flag) {
          that.sortFlag = true;
          that.defaultFlag=true;
        } else {
          that.sortFlag = !that.sortFlag;
          that.defaultFlag=false;
        }
        that.page = 1;
        that.getGoodsList();
      },
      addCart(productId){
        var that = this;
        axios.post('/goods/addCart',{
          productId:productId
        }).then((response)=>{
          let res = response.data;
          if(res.status == '0'){
            that.mdShowCart = true;
          }else{
            that.mdShow = true;
          }
          console.log('success');
        })
      },
      closeModal() {
        this.mdShow = false;
        this.mdShowCart = false;
      },

    },
    components: {
      NavHeader,
      NavBread,
      NavFooter,
      Model
    },
  }
</script>
