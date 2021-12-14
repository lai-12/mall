import {debounce} from "./utils";
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
    data(){
      return {
          itemImageListener:null,
          newRefresh:null
      }
    },
    mounted () {
        this.newRefresh = debounce(this.$refs.scroll.refresh,100)
        this.itemImageListener = () =>{
            this.newRefresh()
        }
        this.$bus.$on('itemImageLoad',this.itemImageListener)
        console.log('我是混入内容');
    }
}

export const backTopMixin = {
    components:{
        BackTop
    },
    data(){
        return {
            isShowBackTop:false
        }
    },
    methods:{
        backtopClick(){
            //this.$refs.scroll拿到的是scroll组件里面的scroll对象
            this.$refs.scroll.scrollTo(0,0,300);
    },
        listenShowBackTop(position){
            this.isShowBackTop = (-position.y)>1000
        }
    }
}