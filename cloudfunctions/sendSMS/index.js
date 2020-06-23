// 云函数入口文件
const cloud = require('wx-server-sdk')
var QcloudSms = require('qcloudsms_js')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let code = event.code
  const appId = ''; // 腾讯云的 appId
  const appkey = ''; // 腾讯云的 appKey

  var phone = '15207123890'
  var templateId = ''
  var smsSign = 'CCDD'
  var qcloudsms = QcloudSms(appid, appkey)
  var sender = qcloudsms.SmssingleSender();
  sender.sendWithParam(
    86,
    phone,
    templateId,
    [code], smsSign, '', '',
    console.log
  )
  
  return {"msg":"ok"}

}