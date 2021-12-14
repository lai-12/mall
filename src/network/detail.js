import {request} from "./request"

//请求商品接口
export function getDetail(iid) {
    return request({
        url:'/detail',
        params:{
            iid
        }
    })
}
export  function getRecommend() {
    return request({
        url:'/recommend'
    })
}
//将商品基本信息过滤到类中
export class Goods {
    //构造函数
    constructor(itemInfo, columns, services) {
        this.desc = itemInfo.desc;
        this.title = itemInfo.title;
        this.iid = itemInfo.iid;
        this.newPrice = itemInfo.price;
        this.oldPrice = itemInfo.oldPrice;
        this.realPrice = itemInfo.lowNowPrice;
        this.discount = itemInfo.discountDesc;
        this.discountBgColor = itemInfo.discountBgColor;
        this.columns = columns;
        this.services = services;

    }
}

// 将店铺信息整合
export class Shop {
    constructor(shopInfo) {
        this.logo = shopInfo.shopLogo;
        this.name = shopInfo.name;
        this.sells = shopInfo.cSells;
        this.goodsCount = shopInfo.cGoods;
        this.score = shopInfo.score;
        this.fans = shopInfo.cFans;
    }
}

// 商品参数整合
export class GoodsParam {
    constructor(info, rule) {
        // 注: images可能没有值(某些商品有值, 某些没有值)
        this.image = info.images ? info.images[0] : '';
        this.infos = info.set;
        this.sizes = rule.tables;
    }
}