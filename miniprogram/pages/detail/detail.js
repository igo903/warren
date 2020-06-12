// pages/detail/detail.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    info:{}
  },

  payOrder(){
    wx.cloud.callFunction({
      name:'pay0610',
      data:{
        goodId: this.data.id
      },
      success: res=>{
        console.log('支付参数获取成功',res)
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res){
            console.log('支付成功', res)
            wx.hideLoading()
          },
          fail(res){
            console.error('支付失败', res)
          }
        })
      },
      fail: res =>{
        console.log('支付参数获取失败', res)
      }
    })
  },


  // payOrder(){

  //   wx.cloud.callFunction({
  //     name:'emall-pay',
  //     
  //     type:'unifiedorder',
  //     data:{
  //       goodId: this.data.id
  //     },
  //     success: result =>{
  //       const data = result.data

  //       //再次签名
  //       wx.cloud.callFunction({
  //         name:'emall-pay',
  //         data:{
  //           type:'orderquery',
  //           data:{
  //             out_trade_no: result.result.data.out_trade_no
  //           }
  //         },
  //         success: queryRet =>{
  //           const {
  //             time_stamp,
  //             nonce_str,
  //             sign,
  //             prepay_id,
  //             body,
  //             total_fee
  //           } = queryRet.result.data

  //           //拉起支付
  //           wx.requestPayment({
  //             nonceStr: nonce_str,
  //             package: `prepay_id=${prepay_id}`,
  //             paySign: sign,
  //             signType: 'MD5',
  //             timeStamp: time_stamp,
  //             success(){
  //               wx.hideLoading()
  //             }
  //           })

  //         }
  //       })
  //     }
  //   })
  // },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      id: options.id
    })

    const ins = db.collection('emall').doc(options.id)
    ins.update({
      data:{
        count:db.command.inc(1)
      }
    })
    ins.get({
      success:res=>{
        this.setData({
          info:res.data
        })
        console.log(res)
      }
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