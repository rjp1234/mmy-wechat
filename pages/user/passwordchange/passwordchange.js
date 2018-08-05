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
  onLoad: function(options) {
    var that = this;
    var cUserInfo = app.globalData.userInfo;
    console.log(cUserInfo);
    that.setData({
      userInfo: cUserInfo
    });
  },
  formSubmit: function() {
    var that=this;

    if (that.data.flag && that.data.passCheckFlag) {



    } else {

      that.setData({
        msg: "密码不合要求，请确认",
        msgColor: "red"
      });
      return;
    }

    if (pas2 != pas1) {
      //密码不一致
      that.setData({
        passCheckFlag: false
      });

      return;
    }
    var userInfo = wx.getStorageSync("mUserInfo");

    var dataparam = "userId=" + userInfo.userId + "&password=" + pas2 + "&accToken=" + userInfo.accToken;
    var ApiUrl = Api.changePassword;
    console.log(ApiUrl);
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {
      if (res.code == 0) {
        wx.setStorageSync("mUserInfo", null);
        app.globalData.userInfo = null;
        //修改成功，跳转至登录页面
        wx.switchTab({
          url: '../../index/index',
        });

      }
    })
  },

  /**
   * 第一次输入密码时触发以下函数,验证密码是否可用
   */
  passwordInput: function(e) {
    var that = this;
    console.log(e)
    var password = e.detail.value;
    var target = e.target.id;
    that.setData({
      passCheckFlag: false

    })
    if (target == "p1") {

      that.setData({
        password1: password,
        flag: false
      });
      /**
       *第一段密码的合法性校验 
       */

      if (password && password.length < 6) {
        that.setData({
          msg: "密码不得小于六位",
          msgColor: "red",

        });
        return;
      } else {
        that.setData({
          msg: "该密码可用",
          msgColor: "green",
          flag: true
        })
      }
    } else {

      that.setData({
        password2: password
      })
      /**
       * 第二次输入密码
       */
      if (!that.data.flag) {


        /**
         * 第一次密码不和要求
         */
        that.setData({
          msg: "第一次输入的密码不和要求",
          msgColor: "red",
          passCheckFlag: false
        });


        return;
      }

      if (that.data.password2 != that.data.password1) {
        /**
         * 密码不同
         */

        that.setData({
          msg: "密码不同",
          msgColor: "red",
          passCheckFlag: false
        });

        return;



      }
      /**
       * 密码相等
       */

      that.setData({
        msg: "密码相同",
        msgColor: "green",
        passCheckFlag: true
      });

    }


  },
  // /**
  //  * 第二次输入密码，移除焦点时，触发以下函数，验证两次密码是否相同
  //  */
  // passwordCheck: function (e) {
  //   var that = this;

  //   //第一次输入未完成
  //   if (!that.data.passCheckFlag) {
  //     return;
  //   }
  //   console.log("green" == that.data.msgColor);
  //   //第一次输入错误
  //   if (!("green" == that.data.msgColor)) {
  //     return;
  //   }

  //   //校对两次输入结果是否一致
  //   var pas1 = that.data.password1;
  //   var pas2 = e.detail.value;
  //   console.log(pas1)
  //   console.log(pas2)
  //   if (pas1 == pas2) {
  //     that.setData({ passCheckFlag: true });
  //     that.setData({ msgColor: "green" });
  //     that.setData({ flag: false });
  //     that.setData({ password2: pas2 });
  //   } else {
  //     that.setData({ passCheckFlag: false });
  //     that.setData({ msgColor: "red" });
  //     that.setData({ flag: true });
  //     that.setData({ msg: "两次输入密码不一致，请确认" });
  //   }
  // },
  back: function() {
    wx.switchTab({
      url: '../../index/index',
    });
  }

})