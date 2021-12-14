<template>
    <!--ref 如果绑定组件中，那么通过 this.$refs.refname获取到一个组件对象
    如果绑定在普通的元素中，那么通过this.$refs.refname获取到的是一个元素对象-->
    <div class="wrapper" ref="wrapper">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name: "Scroll",
        props:{
            probeType:{
                type:Number,
                default:0
            },
            pullUpLoad:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                scroll:null
            }
        },
        mounted(){
            //1.创建BScroll对象
            //通过querySelector不确定能拿到想拿的，所以采用this
            this.scroll = new BScroll(this.$refs.wrapper,{
                click:true,
                //根据传进来的probeType决定是否进行监听
                probeType:this.probeType,
                pullUpLoad:this.pullUpLoad
            })
            //2.监听滚动的位置
            if(this.probeType ===2 || this.probeType ===3) {
                this.scroll.on('scroll', (position) => {
                    // console.log(position);
                    //自定义事件发送出去
                    this.$emit('scroll', position)
                })
            }

            //3.监听上拉加载更多
            if(this.pullUpLoad) {
                this.scroll.on('pullingUp', () => {
                    this.$emit('pullingUp')
                })
            }

        },
        methods:{
            scrollTo(x,y,time=500){
                //加判断
                this.scroll && this.scroll.scrollTo(x,y,time)
            },
            finishPullUp(){
                this.scroll.finishPullUp();
            },
            refresh(){
                this.scroll && this.scroll.refresh()
            },
            getScrollY(){
                return this.scroll ? this.scroll.y :0
            }
        }
    }
</script>

<style scoped>

</style>