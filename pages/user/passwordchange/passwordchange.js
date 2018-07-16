// pages/user/passwordchange/passwordchange.js
var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    flag: false,
    msg: "",
    msgColor: "red",
    password1: "",
    passCheckFlag: false,
    password2: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var cUserInfo = app.globalData.userInfo;
    console.log(cUserInfo);
    that.setData({ userInfo: cUserInfo });
  }
  ,
  formSubmit: function () {

    var that = this;    
    var pas1 = that.data.password1;
    var pas2 = that.data.password2;
    if(pas1==''||pas2==''){
      that.setData({ passCheckFlag: false });
      that.setData({ msgColor: "red" });
      that.setData({ msg: "密码不符合要求" });
      return;
    }
    
  
    if (!(pas2 == pas1)) {
      //密码不一致
      that.setData({ passCheckFlag: false });
      that.setData({ msgColor: "red" });
      that.setData({ msg: "两次密码不一致" });
      return;
    }
    var userInfo = wx.getStorageSync("mUserInfo");
    
    var dataparam = "userId=" + userInfo.userId + "&password=" + pas2 + "&accToken=" + userInfo.accToken;
    var ApiUrl = Api.changePassword;
    console.log(ApiUrl);
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {
      if(res.code==0){
        wx.setStorageSync("mUserInfo", null);
        app.globalData.userInfo=null;
        //修改成功，跳转至登录页面
        wx.switchTab({
          url: '../../index/index',
        });
        
      }
    })
  }
  ,

  /**
   * 第一次输入密码时触发以下函数,验证密码是否可用
   */
  passwordInput: function (e) {
    var that = this;
    var password = e.detail.value;
    that.setData({ flag: true });
    if (password&&password.length < 6) {
      that.setData({ passCheckFlag: false });
      that.setData({ msgColor: "red" });
      that.setData({ msg: "密码不得小于六位" });
      return;
    }
    that.setData({ passCheckFlag: true });
    that.setData({ msgColor: "green" });
    that.setData({ msg: "该密码可用" });
    that.setData({ password1: password });
  },
  /**
   * 第二次输入密码，移除焦点时，触发以下函数，验证两次密码是否相同
   */
  passwordCheck: function (e) {
    var that = this;

    //第一次输入未完成
    if (!that.data.flag) {
      return;
    }
    console.log("green" == that.data.msgColor);
    //第一次输入错误
    if (!("green" == that.data.msgColor)) {
      return;
    }

    //校对两次输入结果是否一致
    var pas1 = that.data.password1;
    var pas2 = e.detail.value;
    if (pas1 == pas2) {
      that.setData({ passCheckFlag: true });
      that.setData({ msgColor: "green" });
      that.setData({ flag: false });
      that.setData({ password2: pas2 });
    } else {
      that.setData({ passCheckFlag: false });
      that.setData({ msgColor: "red" });
      that.setData({ flag: true });
      that.setData({ msg: "两次输入密码不一致，请确认" });
    }
  },
  back:function(){
    wx.switchTab({
      url: '../../index/index',
    });
  }

})