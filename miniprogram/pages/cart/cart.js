const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts:[],
    address:{},
    total:0
  },

  order(){
    if(!this.data.address.userName){
      wx.chooseAddress({
        success: (res) => {
          this.setData({
            address:res
          })
          console.log(res)
        },
      })
    } else {

    }
  },

  addCart(e){
    const {index} = e.currentTarget.dataset
    //复制数据
    const carts =[...this.data.carts]
    carts[index].num += 1
    this.setData({
      carts
    })
    app.globalData.carts = carts
    app.setTabbar()
    this.getTotal()
  },

  removeCart(e){
    const {index} = e.currentTarget.dataset
    const carts = [...this.data.carts]
    if(carts[index].num > 0){
      carts[index].num -= 1
    } else {
      
    }
    this.setData({
      carts
    })
    app.globalData.carts = carts
    app.setTabbar()
    this.getTotal()
  },

  getTotal(){
    
    const total = this.data.carts.reduce((sum, val)=>sum + val.price*val.num, 0)
    this.setData({
      total
    })
    console.log(total)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      carts:app.globalData.carts
    })
    this.getTotal()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})