var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp()
var navList = [{
    id: "lession",
    title: "课文列表"
  }, {
    id: "score",
    title: "我的成绩"
  }, {
    id: 'record',
    title: "我的记录"

  }

];
// pages/user/studiopointrecord/studiopointrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 2,
    navList: navList,
    size: 20,
    time: '',
    recordList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    var that=this;
    that.setData({
      time:"",
      recordList:[]
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
        url: '../../index/index'
      })
    }
    //向服务器发送请求，获取列表

    var ApiUrl = Api.userStudioPointRecordList;
    var recordList = null;
    if (that.data.all) {
      console.log('已经到底了')
      return;
    }

    var dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken + '&size=' + that.data.size + "&time=" + that.data.time;
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {

      if (res.code == '0') {
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
          url: '../../index/index',
        })

      }
    })

  },
  onTapTag: function(e) {
    console.log(e);
    var id = e.target.id;
    if ("lession" == id) {
      wx.switchTab({
        url: '/pages/topics/topics',
      })

    } else if ('score' == id) {
      wx.navigateTo({
        url: '/pages/user/userRankDetail/userRankDetail'
      })
    } else if ('record' == id) {
      wx.navigateTo({
        url: '/pages/user/pointrecord/pointrecord'
      })

    }


  },
  lower:function(){
    this.getData();


  }
})