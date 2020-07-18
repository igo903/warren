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
    list:[],
    tops:[]
  },
  getTop(){
    db.collection('emall').orderBy('count','desc').limit(4).get({
      success:res=>{
        console.log(res.data)
        this.setData({
          tops: res.data
        })
      }
    })
  },
  onPullDownRefresh(){
    this.getList(false)
  },
  onReachBottom(){
    this.page += 1
    this.getList(false)
  },
  getList(isInit){
    console.log(isInit)

    const PAGE = 4
    wx.showLoading({
      title: 'Loading',
    })
    db.collection('emall').skip(this.page * PAGE).limit(PAGE).get({
      success:res => {
        //console.log(999 + res.data)
        
        if(isInit){
          this.setData({
            list:res.data
          })
        } else {
          //叠加
          this.setData({
            list:this.data.list.concat(res.data)
          })
          wx.stopPullDownRefresh()
        }
        wx.hideLoading()
      }
    })
  },

  addCart(e){
    //事件传递数据的一个方法dataset
    const {item} = e.currentTarget.dataset
    //查询是否已有购物数据
    const i = app.globalData.carts.findIndex(v => v._id == item._id)
    //如果找到这个元素了
    if(i > -1){
      app.globalData.carts[i].num += 1
    } else {
      item.num = 1
      app.globalData.carts.push(item)
    }
    app.setTabbar()
  },


  addMall(){
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
                count:1,
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

  deleteIt(e){
    const abc = e.currentTarget.dataset
    console.log(abc.item)
    //console.log(e.currentTarget)
    db.collection('emall').doc(abc.item._id).remove({
      success: function(res) {
        console.log(res)
      }
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

  onShareAppMessage(){
    return {
      title:'南国'
    }
  },

  onLoad: function() {
    wx.showShareMenu()
    
    this.getTop()

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    wx.showLoading({
      title: '加载中...',
    })

    this.page = 0
    this.getList(true)

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
