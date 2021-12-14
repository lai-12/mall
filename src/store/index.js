import Vue from 'vue'
import  Vuex from 'vuex'

//1.安装插件
Vue.use(Vuex)

//2.创建store对象
const  store = new Vuex.Store({
    state:{
        cartList:[]
    },
    mutations:{
        addCounter(state,payload){
            payload.count++
        },
        addToCart(state,payload){
            payload.checked = true
            state.cartList.push(payload)
        }
    },
    actions:{
        //action 可以返回一个promise
        addCart(context,payload){
            return new Promise((resolve,reject) => {
                //payload新添加的商品
                // let oldProduct = null
                // for (let item of state.cartList){
                //     if(item.iid ===payload.iid){
                //         oldProduct = item;
                //     }
                // }

                //1.查找之前数组中是否有该商品
                let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

                //2.判断oldProduct
                if(oldProduct){
                    // oldProduct.count +=1
                    context.commit('addCounter',oldProduct)
                    resolve('当前的商品数量+1')
                }else {
                    payload.count =1
                    // state.cartList.push(payload)
                    context.commit('addToCart',payload)
                    resolve('添加了新商品')
                }

            })
        }
    },
    getters:{
        cartLength(state){
            return state.cartList.length
        },
        cartList(state){
            return state.cartList
        }
    }
})

//3.挂载到vue实例上
export  default  store