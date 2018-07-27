var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp()
var navList = app.globalData.navList;
// pages/user/studiopointrecord/studiopointrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 1,
    navList: navList,
    size: 20,
    time: '',
    recordList: [],
    all: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //该功能需要用到用户数据
    var that = this;
    var mUserInfo = wx.getStorageSync("mUserInfo");
    if (!mUserInfo) {
      //没有用户数据，提醒用户进行登录操作
      wx.showModal({
        title: '请登录',
        content: '使用该功能需要你的个人信息以同步你之前的数据，点击确定跳转登录界面',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            });
          } else {
            //点击取消返回列表
            wx.switchTab({
              url: '/pages/topics/topics',
            });
          }
        }
      })
      return;
    }

    this.getData();
  },
  refresh: function() {
    console.log("refresh");
    var that = this;
    that.setData({
      time: "",
      recordList: [],
      all: false
    });
    that.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      time: "",
      recordList: []
    });
    that.getData();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取文章列表数据
  getData: function() {
    //获取前，先进行accToken和userId的判断，若为空，跳转登陆页面
    var mUserInfo = wx.getStorageSync("mUserInfo");
    app.globalData.userInfo = mUserInfo;

    var that = this;

    if (!mUserInfo) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
   
    if (that.data.all) {
      that.setData({
        hidden: true
      })
      console.log("已经到底了");
      return;
    }
    //向服务器发送请求，获取列表
    that.setData({
      hidden: false

    })


    var ApiUrl = Api.userStudioPointRecordList;
    var recordList = null;

    var dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken + '&size=' + that.data.size + "&time=" + that.data.time;
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {

      if (res.code == '0') {
        console.log(res.data.time)
        if (res.data.time == '') {
          that.setData({
            //全部加载完成
            all: true,
            hidden: true
          })
          return;
        }


        //请求成功
        recordList = res.data.recordList;
        recordList = that.data.recordList.concat(recordList);
        that.setData({
          recordList: recordList,
          //隐藏转圈圈
          hidden: true,
          time: res.data.time
        });


      } else {
        //请求失败，可能是用户登陆失效，跳转用户登陆界面
        wx.switchTab({
          url: '/pages/index/index',
        })

      }
    })

  },
  onTapTag: function(e) {
    app.onTapTag(e);


  },
  lower: function() {
    console.log('下拉加载');
    this.getData();


  }
})