<template>
    <div id="category">
        <!--顶部导航栏-->
        <nav-bar class="nav">
            <div slot="center">商品分类</div>
        </nav-bar>
        <!---->
        <div class="content">
            <!--左侧菜单-->
            <tab-menu :childcategories="categories" @selectItem="selectItem"></tab-menu>
            <scroll id="tab-content">
                <div>
                    <tab-content-category :subcategories="showSubcategory"></tab-content-category>
                    <tab-control :titles="['流行','新款','热门']" @tabClick="tabClick"></tab-control>
                    <category-detail :category-data="showCategoryDetail"></category-detail>
                </div>
            </scroll>
        </div>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import Scroll from "components/common/scroll/Scroll"
    import TabControl from "components/content/tabControl/TabControl"

    import TabMenu from './childComps/TabMenu'
    import TabContentCategory from './childComps/TabContentCategory'
    import CategoryDetail from "./childComps/CategoryDetail";

    import {getCategory, getSubCategory, getCategoryDetail} from "../../network/category";
    export default {
        name: "Category",
        components: {
            TabMenu,
            NavBar,
            Scroll,
            TabContentCategory,
            TabControl,
            CategoryDetail
        },
        data() {
            return {
                categories: [],
                categoryData: {},
                currentIndex: -1,
                currentType: 'pop'
            }
        },
        created(){
            //1.请求数据
            this._getCategory()
    },
        computed:{
            showSubcategory() {
                if (this.currentIndex === -1) return {}
                return this.categoryData[this.currentIndex].subcategories
            },
            showCategoryDetail() {
                if (this.currentIndex === -1) return []
                return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
            }
        },
      methods: {
        _getCategory() {
            getCategory().then(res => {
                // console.log(res);
                // 1.获取分类数据
                this.categories = res.data.category.list
                // 2.初始化每个类别的子数据
                for (let i = 0; i < this.categories.length; i++) {
                    this.categoryData[i] = {
                        subcategories: {},
                        categoryDetail: {
                            'pop': [],
                            'new': [],
                            'sell': []
                        }
                    }
                }
                // 3.请求第一个分类的数据
                this._getSubcategories(0)
            })
        },
          //获取子类别数据
          _getSubcategories(index) {
              this.currentIndex = index;
              const mailKey = this.categories[index].maitKey;
              getSubCategory(mailKey).then(res => {
                  // console.log(res);
                  this.categoryData[index].subcategories = res.data
                  this.categoryData = {...this.categoryData}
                  //请求商品数据
                  this._getCategoryDetail('pop')
                  this._getCategoryDetail('sell')
                  this._getCategoryDetail('new')
              })
          },
          //获取分类数据的商品数据
          _getCategoryDetail(type) {
              // 1.获取请求的miniWallkey
              const miniWallkey = this.categories[this.currentIndex].miniWallkey;
              // 2.发送请求,传入miniWallkey和type
              getCategoryDetail(miniWallkey, type).then(res => {
                  console.log(res);
                  // 3.将获取的数据保存下来
                  this.categoryData[this.currentIndex].categoryDetail[type] = res
                  this.categoryData = {...this.categoryData}
              })
          },
          selectItem(index) {
              this._getSubcategories(index)
          },
          //监听tabControl点击
          tabClick(index) {
              switch (index) {
                  case 0 :
                      this.currentType = 'pop'
                      break
                  case 1:
                      this.currentType = 'new'
                      break
                  case 2:
                      this.currentType = 'sell'
              }
          }
    }
    }
</script>

<style scoped>
    #category {
        /*height: 100px;*/
    }
    .nav {
        background-color: var(--color-tint);
        font-weight: 700;
        color: #fff;
        box-sizing: border-box;
    }
    .content {
        position: absolute;
        left: 0;
        right: 0;
        top: 44px;
        bottom: 49px;
        display: flex;
        /*overflow: hidden;*/
    }
    #tab-content {
        height: 800px;
        flex: 1;
        overflow: hidden;
    }
</style>
