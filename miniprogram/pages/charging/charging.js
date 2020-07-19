Page({
  data:{
    num: 1
  },
  selectAmount:function(e){
    var that = this
    console.log(e)
    that.setData({
      num: e.currentTarget.dataset.num
    })
  },

  onLoad:function(){

  }
})