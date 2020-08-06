const app = getApp()
const db = wx.cloud.database()

Page({
  data:{
    categories: [],
    categorySelected: {
      name: '',
      id: ''
    },
    currentGoods: [],
    onLoadStatus: true,
    scrolltop: 0,

    skuCurGoods: undefined
  },

  onLoad:function(options){
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getCategory()
  },

  getCategory:function(){
    var that = this
    let categories = [];
    let categoryName = '';
    let categoryId = '';

    wx.showLoading({
      title: '加载中...',
    })

    db.collection('canteen').get({
      
      complete: res=>{
        const _curCategory = res.data.find(ele => {
          return ele.id == this.data.categorySelected._id
        })
        categoryName = _curCategory.category_name;
        categoryId = _curCategory.id;
        console.log(_curCategory)

        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          categories.push(item);
          if (i == 0 && !this.data.categorySelected._id) {
            categoryName = item.category_name;
            categoryId = item._id;
          }
        }
        this.setData({
          categories: categories,
          categorySelected: {
            name: categoryName,
            id: categoryId
          }
        })
        console.log(this.data.categorySelected);
        wx.hideLoading();
      }
    })
  },

  onCategoryClick: function(e) {
    var that = this;
    var id = e.target.dataset.id;
    console.log(id)
    if (id === that.data.categorySelected.id) {
      //console.log(that.data.categorySelected.id)
      that.setData({
        scrolltop: 0,
      })
    } else {
      var categoryName = '';
      for (var i = 0; i < that.data.categories.length; i++) {
        let item = that.data.categories[i];
        if (item._id == id) {
          categoryName = item.category_name;
          break;
        }
      }
      that.setData({
        categorySelected: {
          name: categoryName,
          id: id
        },
        scrolltop: 0
      });
      //that.getGoodsList();

      console.log(this.data.categorySelected)

    }
  },


})