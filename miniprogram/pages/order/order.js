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
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('canteen').get({
      success: res=>{
        console.log(res.data)
        this.setData({
          categories: res.data
        })
        wx.hideLoading()
      }
    })
  },

  onCategoryClick: function(e) {
    var that = this;
    var id = e.target.id;
    console.log(e.target.id)
    if (id === that.data.categorySelected.id) {
      console.log(66666)
      that.setData({
        scrolltop: 0,
      })
    } else {
      var categoryName = '';
      for (var i = 0; i < that.data.categories.length; i++) {
        let item = that.data.categories[i];
        console.log()
        if (item.id == id) {
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
    }
  },


})