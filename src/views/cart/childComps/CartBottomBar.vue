<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button
                    :is-checked="isSelectAll"
                    class="check-button"
                    @click.native="checkClick"/>
            <span>全选</span>
        </div>

        <div class="price">
            合计¥:{{totalPrice}}
        </div>

        <div class="calc" @click="calcClick">
            去计算:({{checkLength}})
        </div>
    </div>
</template>

<script>
    import CheckButton from 'components/content/checkButton/CheckButton'
    import {mapGetters} from 'vuex'

    export default {
        name: "CartBottomBar",
        components:{
            CheckButton
        },
        methods:{
            checkClick(){
                if (this.isSelectAll){
                    //全部选中
                    this.$store.state.cartList.forEach(item => item.checked =false)
                }else {
                    //部分或全部不选中
                    this.$store.state.cartList.forEach(item => item.checked =true)
                }
            },
            calcClick(){
                if (!this.isSelectAll){
                    this.$toast.Show('请选择购买的商品',2000)
                }
            }
        },
        computed:{
            ...mapGetters(['cartLength']),
            totalPrice(){
                return this.$store.state.cartList.filter(item=> {
                    return item.checked
                }).reduce((previousValue,item)=>{
                    return previousValue + item.count * item.price
                },0).toFixed(2)

            },
            checkLength(){
                return this.$store.state.cartList.filter(item => item.checked).length
            },
            //判断是否全选
            isSelectAll(){
                if (this.cartLength === 0) {
                    return false
                }else {
                    return !(this.$store.state.cartList.filter(item => !item.checked).length)
                }
            }

        }
    }
</script>

<style scoped>
    .bottom-bar{
        background-color: #dbe5ec;
        position: relative;
        display: flex;
        height: 40px;
        line-height: 40px;
    }
    .check-button{
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-right: 10px;
    }
    .check-content{
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-left: 10px;
        width: 60px;
    }
    .price{
        color: #ff5777;
        padding-left: 50px;
        flex: 1;
        font-size: 13px;
    }
    .calc{
        width: 90px;
        color: white;
        text-align: center;
        background-color: #ff8198;
        font-size: 14px;
    }
</style>