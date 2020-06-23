const db = wx.cloud.database()
const todos = db.collection('todos');


// pages/todoInfo/todoInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:{},
    qr: {}
  },

  pageData:{

  },

  onSubmit: function(event){
    let formId = event.detail.formId
    wx.cloud.callFunction({
      name:'templateMessage',
      data:{
        formId: formId
      }
    })
    console.log(event)
  },
  pushTpl: function(){

  },

  viewRoute:function(){
    console.log(this.data.task)
    console.log(this.data.task.location.latitude)
    
    wx.openLocation({
      latitude: this.data.task.location.latitude,
      longitude: this.data.task.location.longtitude,
      name: this.data.task.location.name,
      address: this.data.task.location.address,
    })
  },

  onInfo:function(event){
    console.log(event.detail.userInfo)
  },

  getQR:function(){
    wx.cloud.callFunction({
      name:'normalQr'
    }).then(res => {
      console.log(res.result.fileID)
      this.setData({
        qr: res.result.fileID
      })
    })
  },

  sendSms:function(){
    wx.cloud.callFunction({
      name:'sendSMS',
      data:{
        "code": 123456
      }
    }).then(console.log)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageData.id = options.id
    console.log(this.pageData.id)
    todos.doc(options.id).get().then(res=>{
      console.log(res)
      this.setData({
        task:res.data
      })
    })
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