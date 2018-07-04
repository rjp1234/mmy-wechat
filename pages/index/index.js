//index.js
//获取应用实例
var app = getApp()
Page({
  data: {

    islogin: false,
    userInfo: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  onShow: function () {
    var that = this;
    var CuserInfo = wx.getStorageSync('mUserInfo');
    console.log(CuserInfo)
    //当前账户已经登录
    if (CuserInfo) {
      that.setData({ islogin: true});
     
    }else{
      that.setData({ islogin: false });
    }
   
    that.setData({
        userInfo:CuserInfo
    })
  },

  changePassword: function () {
    wx.redirectTo({
      url: '../user/passwordchange/passwordchange',
    })
  }
  ,
  onGotUserInfo: function (e) {
    wx.setStorageSync("userInfo", e.detail.userInfo) ;
  },
  logout:function(){
    var that=this;
    wx.removeStorageSync("mUserInfo");
    that.setData({
      islogin: false,
      userInfo: null
    })
    
  }

 

  

}
 


)
