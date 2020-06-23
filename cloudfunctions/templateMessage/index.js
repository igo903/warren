// 云函数入口文件
const cloud = require('wx-server-sdk')
const {WXMINIUser, WXMINIMessage} = require('wx-js-utils')

const appId = 'wxfcb1f1e483d6594f'; // 小程序 appId
const secret = '7eb6cd3d5b67182190375e551f3e47db'; // 小程序 secret

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext();
  let wxMiniUser = new WXMINIUser({
    appId, secret
  })
  let access_token = await wxMiniUser.getAccessToken()
  
  const touser = OPENID
  const formId = event.formId
  const templateId = 'jQHoSuM1ZSHYqgK4Kk2D2xn74JI1rdQ7iWf3PlUUtr8'

  let wxMiniMsg = new WXMINIMessage();
  let result = await wxMiniMsg.sendMessage({
    access_token,
    touser,
    form_id,
    template_id,
    data:{
      keyword1:{
        value:'xxx'
      },
      keyword2:{
        value: 'yyyooo'
      }
    },
    page: '/page/index/index'
  })
  return result
}