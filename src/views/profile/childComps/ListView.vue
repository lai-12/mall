<template>
    <div id="list">
        <div v-for="(item, index) in listData" :key="index" class="item">
        <span class="icon">
          <!--<svg :fill="item.iconColor"><use :xlink:href="item.icon"></use></svg>-->
            <img :src="item.icon"/>
        </span>
            <div class="info">{{item.info}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ListView",
        props:{
            listData:{
                type:Array,
                default:function () {
                    return[]
                }
            }
        }
    }
</script>

<style scoped>
    #list {
        background-color: #fff;
        font-size: 15px;
        color: #333;
    }
    #list .item {
        height: 48px;
        line-height: 44px;
        position: relative;
    }
    .icon img {
        width: 22px;
        height: 22px;
    }
    .item .icon {
        margin-top: 11px;
        position: absolute;
        left: 13px;
        top: -6px;
    }
    .item .info {
        margin-left: 40px;
        border-bottom: 1px solid rgba(100, 100, 100, .1);
        padding-left: 5px;
    }
    /*.item:last-of-type .info {*/
        /*border-bottom: none;*/
    /*}*/
</style>