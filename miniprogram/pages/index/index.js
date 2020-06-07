//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    list:[]
  },

  addMall(){
    // db.collection('emall').add({
    //   data:{
    //     title:'商品',
    //     price:18,
    //     tags:['books','foods','water']
    //   },
    //   success:res=>{
    //     console.log(res)
    //     wx.showToast({
    //       title: '新增成功',
    //     })
    //   }
    // })

    wx.chooseImage({
      count:1,
      success: (res) => {
        const filePath = res.tempFilePaths[0]
        const tempFile = filePath.split('.')
        const cloudPath = 'panda-img-' + tempFile[tempFile.length - 2]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success:res =>{
            console.log(res)
            db.collection('emall').add({
              data:{
                title:'商品',
                price:18,
                tags:['books','foods','water'],
                image:res.fileID
              },
              success:ret=>{
                console.log(ret)
                wx.showToast({
                  title: '新增成功',
                })
              }
            })
          }
        })
        console.log(res)
      },
    })

  },

  toDetail(e){
    const id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id
    })
  },

  getMall(){
    db.collection('emall').get({
      success:(res) => {
        this.setData({
          list: res.data
        })
        wx.hideLoading()
      }
    })
  },

  getPhoneNumber (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    wx.showLoading({
      title: '加载中...',
    })

    this.getMall()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {

    if (!this.data.logged && e.detail.userInfo) {
      wx.cloud.callFunction({
        name:'login',
        success: res=>{
          e.detail.userInfo.openid = res.result.openid
          app.globalData.userInfo = e.detail.userInfo
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

  onGetOpenid: function(e) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        a:10,
        b:20
      },
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
