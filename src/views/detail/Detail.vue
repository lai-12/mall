<template>
    <div id="detail">
        <!--导航-->
        <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick"/>
        <scroll class="content" ref="scroll"
                @scroll="contentScroll"
                :probe-type="3">
           <!--轮播-->
           <detail-swiper :top-images="topImages"/>
           <!--商品基本信息-->
           <detail-base-info :goods="goods"/>
           <!--店铺信息展示-->
           <detail-shop-info :shop="shop"/>
            <!--商品详细信息展示-->
            <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>

            <!--商品参数信息-->
            <detail-param-info ref="param" :param-info="paramInfo"/>
            <!--评论信息-->
            <detail-comment-info ref="comment" :comment-info="commentInfo"/>
            <!--推荐信息展示（图片）-->
            <goods-list ref="recommend" :goods="recommends"/>
        </scroll>

        <!--返回顶部图标-->
        <back-top @click.native="backtopClick" v-show="isShowBackTop"></back-top>

        <!--底部工具栏-->
        <detail-bottom-bar @addCart="addToCart"/>
    </div>
</template>

<script>
    import DetailNavBar from "./childComps/DetailNavBar"
    import DetailSwiper from "./childComps/DetailSwiper"
    import DetailBaseInfo from "./childComps/DetailBaseInfo"
    import DetailShopInfo from "./childComps/DetailShopInfo"
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo"
    import DetailParamInfo from "./childComps/DetailParamInfo"
    import DetailCommentInfo from "./childComps/DetailCommentInfo"
    import DetailBottomBar from "./childComps/DetailBottomBar"

    import Scroll from "components/common/scroll/Scroll"
    import GoodsList from "components/content/goods/GoodsList"

    import {getDetail,getRecommend,Goods,Shop,GoodsParam} from "../../network/detail";
    import {debounce} from "../../common/utils";
    import {itemListenerMixin,backTopMixin} from "common/mixin";

    import {mapActions} from 'vuex'

    export default {
        name: "Detail",
        components:{
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            Scroll,
            GoodsList
        },
        mixins:[itemListenerMixin,backTopMixin],
        data(){
            return{
                iid:null,
                topImages:[],
                goods:{},
                shop:{},
                detailInfo:{},
                paramInfo:{},
                commentInfo:{},
                recommends:[],
                themeTopYs:[],
                getThemeTopY:null,
                currentIndex:0
            }
        },
        created(){
            //1.保存传入的iid
            // console.log('ss',this.$route.params.iid);
            this.iid = this.$route.params.iid

            //2.根据iid请求详情数据
            getDetail(this.iid).then(res =>{
                console.log(res);
                const data = res.result
                //1.获取顶部轮播图数据
                this.topImages = data.itemInfo.topImages

                //2.获取商品基本信息
                this.goods = new Goods(data.itemInfo, data.columns,data.shopInfo.services)

                //3.创建店铺信息
                this.shop = new Shop(data.shopInfo)

                //4.获取商品详细信息
                this.detailInfo = data.detailInfo

                //5.获取商品参数的信息
                this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

                //6.获取评论信息
                this.commentInfo = data.rate.list[0]


            })

            //3.请求推荐数据
            getRecommend().then(res =>{
                console.log(res);
                this.recommends = res.data.list
            })

            //4.给getThemeTopY赋值 (对this.themeTopYs赋值操作进行防抖)
            this.getThemeTopY = debounce(()=>{
                //获取不同组件的offsetTop
                this.themeTopYs=[]
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.param.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

                console.log(this.themeTopYs);

            },100)

        },
        mounted(){

        },
        methods:{
            //将store里面的action 方法映射到这里
            ...mapActions(['addCart']),
            detailImageLoad(){
                this.newRefresh()
                //在图片加载完成后，获取offsettop,获取高度才是正确的
                this.getThemeTopY()
            },
            //点击导航栏跳转页面
            titleClick(index){
                // console.log('ooo');
                this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
            },
            //滚动详情页与顶部导航栏的对应
            contentScroll(position){
                //1.获取Y值
                const  positionY = -position.y

                let length = this.themeTopYs.length

                //2.positionY和主题中值进行对比
                for (let i=0; i < length; i++){
                   if(this.currentIndex !==i && (( i < length-1 && positionY >= this.themeTopYs[i] && positionY <
                       this.themeTopYs[i+1]) ||(i=== length-1 && positionY >= this.themeTopYs[i]))){
                       this.currentIndex = i;
                       // console.log(this.currentIndex);
                       this.$refs.nav.currentIndex = this.currentIndex
                   }
                }

                //3.判断是否显示回到顶部按钮
                //抽取 混入
                this.listenShowBackTop(position)
            },
            //添加购物车
            addToCart(){
                //1.获取购物车需要展示的商品信息
                const  product ={}
                product.image = this.topImages[0]
                product.title = this.goods.title
                product.desc = this.goods.desc
                product.price = this.goods.realPrice
                product.iid = this.iid

                //2.将商品添加到购物车
                this.addCart(product).then(res =>{
                    console.log(res);

                    this.$toast.Show(res)
                })

                // this.$store.dispatch('addCart',product).then(res => {
                //     console.log(res);
                // })
            }
        },

        destroyed(){
            this.$bus.$off('detailImageLoad',this.itemImageListener)

        }
    }
</script>

<style scoped>
  #detail{
      position: relative;
      z-index: 9;
      background-color: #fff;
      height: 100vh;
  }
  /*让详情页导航显示*/
  .detail-nav{
      z-index: 9;
      position: relative;
      background-color: #fff;
  }
  .content{
      height:calc(100% - 44px - 49px);
  }
</style>