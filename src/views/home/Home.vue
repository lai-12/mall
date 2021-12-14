<template>
  <div id="home">
    <!-- 顶部 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
   <!--@scroll="contentScroll"  监听自定义事件，然后处理
      :probe-type="3" 向scroll组件传入对象-->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <!--轮播图-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <!--推荐信息展示-->
      <recommend-view :recommends="recommends"></recommend-view>
      <!--推荐图片-->
      <feature-view/>
      <!-- 当滑动到一定位置，出现这个tabcontrol，实现吸顶效果 -->
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <!--商品展示-->
      <good-list :goods="showGoods"/>
    </scroll>

       <!--回到顶部功能-->
    <back-top @click.native="backtopClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import GoodList from 'components/content/goods/GoodsList'
  import TabControl from 'components/content/tabControl/TabControl'
  import Scroll from 'components/common/scroll/Scroll';


  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'


  import {getHomeMultidata,getHomeGoods} from "../../network/home";
  import {itemListenerMixin,backTopMixin} from "common/mixin";

  export default {
        name: "Home",
        components:{
            NavBar,
            TabControl,
            GoodList,
            HomeSwiper,
            RecommendView,
            FeatureView,
            Scroll,
        },
      mixins:[itemListenerMixin,backTopMixin],
      data(){
        return {
            banners:[],
            recommends:[],
            goods:{
                'pop':{page:0,list:[]},
                'new':{page:0,list:[]},
                'sell':{page:0,list:[]}
            },
            currentType:'pop',
            tabOffsetTop:0,
            isTabFixed:false,
            saveY:0,
        }
      },
      computed:{
        showGoods(){
            return this.goods[this.currentType].list
        }
      },
      //获取home离开时记录信息和位置
      activated(){
            this.$refs.scroll.refresh()
            this.$refs.scroll.scrollTo(0,this.saveY,0)
      },
      deactivated(){
            //1.保存y值
            this.saveY = this.$refs.scroll.getScrollY()

            //2.取消全局事件的监听
            this.$bus.$off('itemImageLoad',this.itemImageListener)
      },

      created(){
            //1.请求多个数据
          this.getHomeMultidata()

           //2.请求商品数据
          this.getHomeGoods('pop')
          this.getHomeGoods('new')
          this.getHomeGoods('sell')


      },
      mounted(){
          //  const refresh = debounce(this.$refs.scroll.refresh)
          //
          // //1.监听item中图片加载完成
          // //解决首页中 better-scroll 滚动区域出现的bug
          //
          // //2.对监听事件进行保存
          // this.itemImageListener =() =>{
          //      refresh()
          // }
          // this.$bus.$on('itemImageLoad',this.itemImageListener)
          // //对于refresh非常频繁的问题 进行防抖操作
          //     // 可以将refersh函数传入debounce函数中，生成一个新函数，之后在调用非常频繁的时候，
          //     //就使用新生成的函数，而新生成的函数并不会非常频繁的调用，如果下一次执行来得很快，那么会将上一次取消)

      },
      methods:{
            /**
             * 事件监听方法
             * */
            //监听tabControl组件的点击
          tabClick(index){
              // console.log(index);
              switch (index){
                  case 0:
                      this.currentType = 'pop'
                      break
                  case 1:
                      this.currentType = 'new'
                      break
                  case 2:
                      this.currentType = 'sell'
                      break
              }
              //让两个tabControl保持一致
            if (this.$refs.tabControl1 !== undefined){
               this.$refs.tabControl1.currentIndex = index;
               this.$refs.tabControl2.currentIndex = index;
           }
          },
          // //监听回到顶部的方法
          // backtopClick(){
          //     //this.$refs.scroll拿到的是scroll组件里面的scroll对象
          //     this.$refs.scroll.scrollTo(0,0);
          // },
          //判断是否显示回到顶部小图标
          contentScroll(position){
              // 1.判断BackTop是否显示
              // this.isShowBackTop = (-position.y)>1000
              //抽取混入
              this.listenShowBackTop(position)

              //2.判断tabControl是否吸顶(position:fixed)
              this.isTabFixed = (-position.y) > this.tabOffsetTop
          },
          loadMore(){
              // console.log('上拉加载');
              this.getHomeGoods(this.currentType)

          },

          //获取tabControl的offsetTop
          swiperImageLoad(){
              this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
              // console.log(this.$refs.tabControl.$el.offsetTop);
          },
          /**网络请求相关方法
           *
           * */

          getHomeMultidata(){
              getHomeMultidata().then(res =>{
                  console.log(res);
                  //拿到数据赋值给data里面的属性
                  this.banners= res.data.banner.list;
                  this.recommends =res.data.recommend.list;
              })
          },
          getHomeGoods(type){
              const  page = this.goods[type].page+1;
              getHomeGoods(type,page).then(res =>{
                  console.log(res);
                  //...（特殊语法）挨个添加
                  this.goods[type].list.push(...res.data.list)
                  this.goods[type].page +=1

                  //完成上拉加载更多
                  this.$refs.scroll.finishPullUp()
              })
          }
      }
    }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color:var(--color-tint);
    color: white;

    /*使用原生滚动的时候 让导航栏不跟随滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/

  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }

</style>
