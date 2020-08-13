const db = wx.cloud.database()

Page({
  data:{
    id:'',
    info:{}
  },

  onLoad: function(options){
    console.log(options)
    this.setData({
      id: options.id,
    })

    const ins = db.collection('canteen').doc(options.id)
    ins.get({
      success:res =>{
        this.setData({
          info:res.data
        })
        console.log(res)
      }
    })

    


  }
})
