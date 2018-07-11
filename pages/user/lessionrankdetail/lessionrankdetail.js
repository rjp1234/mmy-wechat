// pages/user/lessionrankdetail/lessionrankdetail.js
var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    lessionId: '',
    rankList: [],
    studio: null,
    time: '',
    lession: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var lessionId = options.lessionId;
    this.setData({
      lessionId: lessionId

    });
    this.getData();

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
        url: 'pages/index/index'
      })
    }
    //向服务器发送请求，获取列表

    var ApiUrl = Api.lessionRankingDetail;

    var dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken + '&lessionId=' + that.data.lessionId;
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {

      if (res.code == '0') {
        //请求成功
        var studio = res.data.studio;
        var rankList = res.data.rankList;
        for (var i = 0; i < rankList.length; i++) {
          rankList[i].ranking = (i + 1);
        }

        var lession = res.data.lession;
        that.setData({
          rankList: rankList,
          studio: studio,
          lession: lession,
          //隐藏转圈圈
          hidden: true
        });
        console.log(that.data.studio);
        console.log(that.data.rankList);




      } else {
        //请求失败，可能是用户登陆失效，跳转用户登陆界面
        wx.switchTab({
          url: '/pages/index/index',
        })

      }
    })

  }
})