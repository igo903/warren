//index.js
const app = getApp()
const db = wx.cloud.database()

Page({

  data:{
    userInfo:{},
    hasUser:false,
    avatarUrl: './user-unlogin.png',
    list:[],
    tops:[],
    logged: false,
    takeSession: false,
    requestResult: '',  
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },

  toDailyDetail(e){
    const id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/dailyDetail/dailyDetail?id='+ id,
    })
    console.log(id)
  },

  getTop(){
    db.collection('top').orderBy('count','desc').limit(4).get({
      success:res=>{
        console.log(res.data)
        this.setData({
          tops: res.data
        })
      }
    })
  },

  addTop(){
    wx.chooseImage({
      count: 1,
      success: function(res){
        const filePath = res.tempFilePaths[0]
        const tempFile = filePath.split('.')
        const cloudPath = 'top-'+tempFile[tempFile.length - 2]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res=>{
            console.log(res)
            db.collection('top').add({
              data:{
                title:'商品2',
                price:90,
                tags:['川菜','辣味'],
                image:res.fileID
              },
              success:result=>{
                //console.log(result)
                wx.showToast({
                  title: '新增成功',
                })
              }
            })
          }
        })
      }
    })
  },

  getDaily(){
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('canteen').get({
      success: res=>{
        this.setData({
          list: res.data
        })
        wx.hideLoading()
        
      }
    })
    
  },


  onGetUserInfo: function(e) {
    
    if (!this.data.logged && e.detail.userInfo) {
      //app.globalData.userInfo = e.detail.userInfo
      console.log(app.globalData.userInfo)
      wx.cloud.callFunction({
        name:'login',
        success: res=>{
          e.detail.userInfo.openid = res.result.openid
          this.setData({
            logged: true,
            avatarUrl: e.detail.userInfo.avatarUrl,
            userInfo: e.detail.userInfo
          })
          wx.setStorageSync('userInfo', e.detail.userInfo)
        }
      })
    }
    
  },

  addCusie:function(){

    wx.chooseImage({
      count: 1,
      success: function(res){
        const filePath = res.tempFilePaths[0]
        const tempFile = filePath.split('.')
        const cloudPath = 'canteen-'+tempFile[tempFile.length - 2]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res=>{
            console.log(res)
            db.collection('canteen').add({
              data:{
                title:'商品2',
                price:90,
                tags:['川菜','辣味'],
                image:res.fileID
              },
              success:result=>{
                //console.log(result)
                wx.showToast({
                  title: '新增成功',
                })
              }
            })
          }
        })
      }
    })

    
  },

  bindGetUserInfo: function(e){
    console.log(e)
    userInfo: e.detail.userInfo
  },

  onShareAppMessage:function(){},

  onLoad: function(options){
    console.log(app.globalData)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })


    this.getDaily()
    this.getTop()

  }

  
})