const {
  WXMINIUser,
  WXMINIQR
} = require('wx-js-utils');

const appId = 'wxfcb1f1e483d6594f'; // 小程序 appId
const secret = '7eb6cd3d5b67182190375e551f3e47db'; // 小程序 secret



// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 获取小程序码，A接口
  let wXMINIUser = new WXMINIUser({
    appId,
    secret
  });

// 一般需要先获取 access_token
  let access_token = await wXMINIUser.getAccessToken();
  let wXMINIQR = new WXMINIQR();
  let qrResult = await wXMINIQR.getMiniQRLimit({
    access_token,
    path: 'pages/index/index',  
});

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

  return await cloud.uploadFile({
    cloudPath: 'normalQr.png',
    fileContent:  qrResult
  })

}