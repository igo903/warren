//app.js
App({

  onLaunch: function () {
    this.setTabbar()
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

  },
  setTabbar(){
    wx.setStorageSync('carts', this.globalData.carts)
    const len = this.globalData.carts.reduce((sum, a) => sum+a.num, 0)
    if(len >0){
      wx.setTabBarBadge({
        index: 1,
        text: len + '',
      })
    }
  },


  //获取用户信息
  getUserInfo:function(cb){
    var that = this
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            console.log(res.userInfo);
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
  },
  //获取手机信息
  getSys:function() {
    var that = this;
    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    wx.getSystemInfo({
    success: function(res) {
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
  //设置变量值
      that.globalData.sysInfo=res;
      that.globalData.windowW=res.windowWidth;
      that.globalData.windowH=res.windowHeight;
    }
    })
  },

  globalData:{
    userInfo:{},
    sysInfo:null,
    windowW:null,
    windowH:null,
    wzCarts:[],
    carts:wx.getStorageSync('carts') || []
  }

})
