const db = wx.cloud.database();
const todos = db.collection('todos');


Page({

  data:{
    tasks:[],
    image:null

  },

  selectImage:function(e){
    wx.chooseImage({
      success:res => {
        console.log(res.tempFilePaths[0])
        wx.cloud.uploadFile({
          cloudPath: `${Math.floor(Math.random()*10000)}.png`,
          filePath: res.tempFilePaths[0]
        }).then(res=>{
          console.log(res.fileID)
          this.setData({
            image: res.fileID
          })
        }).catch(err =>{
          console.error(err)
        })
      },
    })
  },

  myLocation:function(e){
    wx.chooseLocation({
      success: res => {
        console.log(res)
        let locationObj = {
          latitude: res.latitude,
          longtitude: res.longitude,
          name: res.name,
          address: res.address
        }
        this.pageData.locationObj = locationObj
      },
    })
  },

  onLoad:function(options){
    this.getData(res=>{})
  },

  onSubmit: function(event){
    todos.add({
      data:{
        title: event.detail.value.title,
        image: this.data.image,
        location: this.pageData.locationObj
      }
    }).then(res =>{
      console.log(res._id)
      wx.showToast({
        title: '添加成功',
        icon:'success',
        success: res2=>{
          wx.redirectTo({
            url: `../todoInfo/todoInfo?id=${res._id}`,
          })
        }
      })
    })
  },

  onPullDownRefresh:function(){
    this.getData(res =>{
      wx.stopPullDownRefresh()
      this.pageData.skip = 0
    })
  },

  onReachBottom:function(event){
    this.getData()
    console.log('bottom')
  },
  
  getData:function(callback){

    if(!callback){
      callback = res =>{}
    }

    wx.showLoading({
      title: 'Loading',
    })
    todos.skip(this.pageData.skip).get().then(res =>{
      //console.log(res)
      let oldData = this.data.tasks;
      this.setData({
        tasks: oldData.concat(res.data)
      }, res=>{ 
        this.pageData.skip =  this.pageData.skip + 10
        wx.hideLoading()
        callback() 
      })
    })
  },

  pageData:{
    skip: 0,
    locationObj:{}
  }

})