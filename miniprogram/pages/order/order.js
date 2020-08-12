const app = getApp()
const db = wx.cloud.database()

Page({
  data:{
    carts:[],
    categories: [],
    categorySelected: {
      name: '',
      id: '',
      cid: ''
    },
    currentGoods: [],
    onLoadStatus: true,
    scrolltop: 0,
    totalPrice:0,
    totalNumber:0,
    skuCurGoods: undefined
  },

  getTotal(){
    const total = this.data.reduce((sum, a)=>sum + a.price*a.num, 0)
    this.setData({
      total
    })
  },

  addCart:function(e){

    const {item, index} = e.currentTarget.dataset
    const i = app.globalData.wzCarts.findIndex(v =>v._id == item._id)
    const currentGoods = JSON.parse(JSON.stringify(this.data.currentGoods))
    currentGoods[index].num++
    this.setData({
      currentGoods: currentGoods
    })
    console.log(item, index)

    if(i>-1){
      app.globalData.wzCarts[i].num += 1
    } else {
      item.num ++;
      app.globalData.wzCarts.push(item)
    }
    this.totalNumberFn()
  },

  minusCart: function(e){
    const {item, index} = e.currentTarget.dataset
    const i = app.globalData.wzCarts.findIndex(v =>v._id == item._id)
    const currentGoods = JSON.parse(JSON.stringify(this.data.currentGoods))

    if(currentGoods[index].num < 1){
      currentGoods[index].num = 0
    } else {
      currentGoods[index].num--
    }

    
    this.setData({
      currentGoods: currentGoods
    })
    console.log(item, index)

    if(i>-1){
      if(app.globalData.wzCarts[i].num < 1){
        app.globalData.wzCarts[i].num = 0
      } else {
        app.globalData.wzCarts[i].num -= 1
      }

      
    } else {
      item.num --;
      app.globalData.wzCarts.push(item)
    }
    this.totalNumberFn()

  },


  totalNumberFn: function () {
    let total = 0
    let totalPrice = 0
    for (const item of app.globalData.wzCarts){
      total += item.num
      totalPrice += item.num * item.price
    }
    app.globalData.totalNumber = total
    app.globalData.totalPrice = totalPrice
    this.setData({
      totalNumber: total,
      totalPrice: totalPrice
    })
  },

  onShow:function(){
    console.log(app.globalData.wzCarts)
    this.setData({
      carts: app.globalData.wzCarts
    })
    this.totalNumberFn()

    //this.getTotal()
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

    db.collection('category').get({

      complete: res=>{
        console.log(res.data)
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
            id: categoryId,
            cid: _curCategory.cid
          }
        })
        this.getGoodsList(_curCategory.cid)
        console.log(categoryId, 'categoryId');
        wx.hideLoading();
      }
    })
    
  },

  getGoodsList:function(id){
    wx.showLoading({
      title: '加载中...',
    })

    db.collection('canteen').where({
      cid: id
    }).get({
      success: res =>{
        console.log(res.data, 'res')
        const goodsList = res.data
        if(app.globalData.wzCarts.length === 0) {
          this.setData({
            currentGoods: goodsList
          });
        } else {
          for (let item of goodsList) {
            for (let ite of app.globalData.wzCarts) {
              if (item._id === ite._id) {
                item.num = ite.num
                continue
              }
            }
          }
          this.setData({
            currentGoods: goodsList
          });
        }
        
      }
    })
    wx.hideLoading()
  },

  onCategoryClick: function(e) {
    var that = this;
    var id = e.target.dataset.id;
    console.log(that.data)
    if (id === that.data.categorySelected.id) {
      //console.log(that.data.categorySelected.id)
      that.setData({
        scrolltop: 0,
      })
    } else {
      var categoryName = '';
      var cid = ''
      for (var i = 0; i < that.data.categories.length; i++) {
        let item = that.data.categories[i];
        if (item._id == id) {
          categoryName = item.category_name;
          cid = item.cid
          break;
        }
      }
      that.setData({
        categorySelected: {
          name: categoryName,
          id: id,
          cid: cid
        },
        scrolltop: 0
      });
      that.getGoodsList(cid);
    }
  },

  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },


})