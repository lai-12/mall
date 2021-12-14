<template>
    <div class="user">
        <a href="">
            <slot name="user-icon">
                <img src="@/assets/img/profile/avatar.svg" class="image-svg"/>
            </slot>
        </a>

        <div class="login">
            <slot><div>登陆/注册</div></slot>
            <slot><div class="phone">暂无绑定手机号</div></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserInfo"
    }
</script>

<style scoped>
    .user{
        height: 100px;
        background-color:#ff8198;
    }
    .image-svg{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        float: left;
        margin:5px;
    }
    .login{
        padding-top: 20px;
        color: white;
    }
    .phone{
        font-size: 14px;
        padding:10px;
    }
</style>