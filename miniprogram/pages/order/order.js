const WXAPI = require('apifm-wxapi')

Page({
  data:{
      categories:[],
      categorySelected: {
        name: '',
        id: ''
      },
      currentGoods: [],
      onLoadStatus: true,
      scrolltop: 0,
  
      skuCurGoods: undefined
  },

  onLoad: function(options) {

    WXAPI.province().then(res => {
      console.log('请在控制台看打印出来的数据：', res)
    })
    
    wx.showShareMenu({
      withShareTicket: true
    })
    this.categories();
  },

  async categories() {
    wx.showLoading({
      title: '加载中',
    })
    const res = await WXAPI.goodsCategory()
    wx.hideLoading()
    let categories = [];
    let categoryName = '';
    let categoryId = '';
    if (res.code == 0) {
      if (this.data.categorySelected.id) {
        const _curCategory = res.data.find(ele => {
          return ele.id == this.data.categorySelected.id
        })
        categoryName = _curCategory.name;
        categoryId = _curCategory.id;
      }
      for (let i = 0; i < res.data.length; i++) {
        let item = res.data[i];
        categories.push(item);
        if (i == 0 && !this.data.categorySelected.id) {
          categoryName = item.name;
          categoryId = item.id;
        }
      }
    }
    this.setData({
      categories: categories,
      categorySelected: {
        name: categoryName,
        id: categoryId
      }
    });
    this.getGoodsList();
  },
  async getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    const res = await WXAPI.goods({
      categoryId: this.data.categorySelected.id,
      page: 1,
      pageSize: 100000
    })
    wx.hideLoading()
    if (res.code == 700) {
      this.setData({
        currentGoods: null
      });
      return
    }
    this.setData({
      currentGoods: res.data
    });
  },

  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  onCategoryClick: function(e) {
    var that = this;
    var id = e.target.dataset.id;
    if (id === that.data.categorySelected.id) {
      that.setData({
        scrolltop: 0,
      })
    } else {
      var categoryName = '';
      for (var i = 0; i < that.data.categories.length; i++) {
        let item = that.data.categories[i];
        if (item.id == id) {
          categoryName = item.name;
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
      that.getGoodsList();
    }
  },

  


})