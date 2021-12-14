<template>
    <div class="profile">
        <!--顶部导航-->
        <nav-bar class="nav-bar">
            <div slot="center">我的</div>
        </nav-bar>
        <!--用户基本信息-->
        <user-info></user-info>
        <!--用户详细信息-->
        <div class="p">
            <detail-info>
                <div slot="name">0.00  <span>元</span></div>
                <div slot="value">我的余额</div>
            </detail-info>
            <detail-info>
                <div slot="name">0 <span>个</span> </div>
                <div slot="value">我的优惠</div>
            </detail-info>
            <detail-info>
                <div slot="name">0 <span>分</span></div>
                <div slot="value">我的积分</div>
            </detail-info>
        </div>
        <!---->
        <list-view :list-data="orderList" class="order-list"></list-view>
        <list-view :list-data="serviceList" class="service-list"></list-view>
    </div>
</template>

<script>
    import UserInfo from "./childComps/UserInfo"
    import DetailInfo from "./childComps/DetailInfo"
    import ListView from "./childComps/ListView"

    import NavBar from "components/common/navbar/NavBar"
    export default {
        name: "Profile",
        components:{
            DetailInfo,
            UserInfo,
            ListView,
            NavBar
        },
        data(){
            return{
                orderList:[
                    {icon: require('assets/img/profile/message.svg'), iconColor: '#ff8198', info: '我的消息'},
                    {icon: require("../../assets/img/profile/pointer.svg"), iconColor: '#fc7b53', info: '积分商城'},
                    {icon: require("../../assets/img/profile/vip.svg"), iconColor: '#ffc636', info: '会员卡'}
                ],
                serviceList: [
                    {icon: require("../../assets/img/profile/cart.svg"), iconColor: '#ff8198', info: '我的购物车'},
                    {icon: require("../../assets/img/profile/shopping.svg"), iconColor: '#ff8198', info: '下载购物APP'},
                ]
            }
        }
    }
</script>

<style scoped>
    .nav-bar {
        background-color: #ff8198;
        color: white;
    }
    .p{
        display: flex;
    }
    .p span{
        color:#666666;
        font-weight: normal;
        font-size: 15px
    }
</style>
