var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    loading: false,
    loginname: "",
    password: "",
    msg1: "",
    msg2: "",
    error: "",
    userInfo: {}
  },

  onLoad: function () {
    var mUserInfo = wx.getStorageSync("mUserInfo");
    console.log(mUserInfo)
    if (mUserInfo) {
      wx.switchTab({
          url: '../index/index',
        })
    }
  },

  bindLoginname: function (e) {
    console.log(1)
    this.setData({
      loginname: e.detail.value
    })
  },

  bindPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },



  // 登录
  login: function () {
    var that = this;
    var loginname = that.data.loginname;
    var password = that.data.password;
    var ApiUrl = Api.login;
    that.setData({ msg1: "" });
    that.setData({ msg2: "" });
    if (loginname === "") {
      that.setData({ msg1: "账户名不得为空" });
      return;
    }

    if (password === "")
    {
      that.setData({msg2:"密码不得为空"});
      return;
    }
    if (loginname.length < 3) {
      that.setData({ msg1: "账户名输入错误" });
      return;
    }

    if(password.length<6){
      that.setData({ msg2: "密码错误" });
      return;
    }

    //获取微信用户信息
    var userInfo = wx.getStorageSync("userInfo");
    //正在加载中图片显示
    that.setData({ loading: true });
    //拼接请求参数
    var dataparam = "loginname=" + loginname + "&password=" + password + "&nickname=" + userInfo.nickName + "&image=" + userInfo.avatarUrl;

      Api.fetchPost(ApiUrl, dataparam, (err, res) => {
        
        that.setData({ loading: false });
       
      //成功获取后台响应时
      if (res.code=='0') {
        var mUserInfo = {
          //获取返回的用户信息
          accToken: res.data.accToken,//用户通行令牌
          userId: res.data.userId,//用户id
          lastLoginTime: res.data.lastLoginTime,//用户最后一次登录时间
          image: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          loginname:loginname,
          phonenum:res.data.phonenum
        };
        //将data存储本地缓存
        wx.setStorageSync('mUserInfo', mUserInfo);
        //跳转至我的页面

      } else {
        that.setData({msg1:"用户账户密码错误"});
      }
      var mUserInfo = wx.getStorageSync("mUserInfo");
      if (mUserInfo) {
      var pages=getCurrentPages();//获取加载的页面栈
      var prevpage=pages[pages.length-2];//获取上一页面（在这里为index页面）
  
      prevpage.setData({ islogin: true, userInfo: mUserInfo});
      wx.switchTab({
          url: '../index/index',
        });
      }

    });
   
  }
})
