// 云函数入口文件
const cloud = require('wx-server-sdk');
const tenpay = require('tenpay');



cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const config = {
    appid: '',
    mchid: '',
    partnerKey: '',
    notify_url: ''
  }
  const api = new tenpay(config)
  return await api.getPayParams({
    out_trade_no:'',
    body:'买它买它',
    total_fee:'1',
    openid:wxContext.OPENID
  })
}