Page({
  data:{
    id:'',
    imgurl:''
  },

  onLoad: function(options){
    console.log(options)
    this.setData({
      id: options.id,
      imgurl:options.image
    })
  }
})
