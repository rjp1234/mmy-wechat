// pages/mypage/mypage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   mUser:{},
   phoneExits:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var userInfo=wx.getStorageSync("mUserInfo");
    //测试
    userInfo={nickname:"测试"};
    that.setData({mUser:userInfo});
    //测试
    //var phone =userInfo.phonenum;
    var phone ="13819828736";
    if(phone.length==11){
      that.setData({phoneExits:true});
    }


  }

})