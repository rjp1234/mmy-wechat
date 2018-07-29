'use strict';
// api 路径
//var HOST = 'http://127.0.0.1:8090/mengmengyuan/';
//var HOST ='https://www.mengmengyuan.club/mengmengyuan/';
var HOST = 'http://123.207.146.145:8080/mengmengyuan/' ;
//用户模块
var user_module = 'user';
var login = HOST + user_module + '/login';
var changePassword = HOST + user_module + "/changePassword";
var userDetail = HOST + user_module + "/userDetail";
//游客模式
var tourist_module = "touristLession";
var touristLessionList = HOST + tourist_module + "/lessionList";
var touristLessionForm = HOST + tourist_module + "/lessionForm";
//课文模块
var lession_module = 'lession';
var lessionList = HOST + lession_module + '/lessionList';
var lessionForm = HOST + lession_module + '/lessionForm';
var lessionRankingDetail = HOST + lession_module + '/lessionRankingDetail'
// 录音模块
var studio_module = "studio";
var studioUpload = HOST + studio_module + "/uploadStudio";
var userStudioPointRecordList = HOST + studio_module + "/userStudioPointRecordList"


// post请求方法
function fetchPost(url, data, callback) {
  wx.request({
    method: 'POST',
    url: url,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data,
    success(res) {
      if (res.data.code == '0004' || res.data.code == '0007') {
        //用户令牌失效
        wx.removeStorageSync("mUserInfo");
      }
      callback(null, res.data)
    },
    fail(e) {
      console.error(e)
      callback(e)
    }
  })
}

module.exports = {
  // API
  lessionList: lessionList,
  login: login,
  changePassword: changePassword,
  lessionForm: lessionForm,
  studioUpload: studioUpload,
  userDetail: userDetail,
  userStudioPointRecordList: userStudioPointRecordList,
  lessionRankingDetail: lessionRankingDetail,
  touristLessionForm: touristLessionForm,
  touristLessionList: touristLessionList,
  // METHOD

  fetchPost: fetchPost

}