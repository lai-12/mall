module.exports = {
    plugins: {
        autoprefixer: {},
        "postcss-px-to-viewport": {
            viewportWidth: 375,  //视图的宽度
            viewportHeight: 667, //视图的高度
            unitPrecision: 5,//指定‘px’转换为视窗单位的小数位 小数点后几位
            viewportUnit: 'vw',//转成的单位
            selectorBlackList: ['ignore','tab-bar','tab-bar-item'],//不需要转换的类
            minPixelValue: 1,//小于或等于1px的不转换成视窗单位
            mediaQuery: false, //允许在媒体查询中转换
        }
    }
}

//1.在js中使用正则：/***/
//2.exclude中存放放入元素必须是正则表达式