var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var app = getApp()
var navList = app.globalData.navList;
var lessionListUrl = Api.lessionList;

Page({
  data: {
    activeIndex: 0,
    navList: navList,
    postsList: [],
    hidden: false,
    pageNo: 1,
    pageSize: 20,
    all: false,
    isLogin: false

  },
  /**
   * 
   */
  moduleChange: function() {
      var url;
      var that = this;
      var mUserInfo = wx.getStorageSync("mUserInfo");
      if (!mUserInfo) {
        url = Api.touristLessionList;
        //提示登录
        that.setData({
          isLogin: false
        })

      } else {
        url = Api.lessionList;
        //关闭登录提示
        that.setData({
          isLogin: true
        })

      }
      if (url != lessionListUrl) {

        //模式切换了
        lessionListUrl = url;
        that.setData({
          pageNo: 1,
          pageSize: 20,
          all: false,
          postsList: []
        })

      }
    }


    ,
  onShow: function() {




    this.setData({
      pageNo: 1,

      postsList: [],
      all: false

    })
    this.getData();

  },

  refresh: function() {
    this.setData({
      pageNo: 1,

      postsList: [],
      all: false

    })
    this.getData();
  },


  //获取文章列表数据
  getData: function() {
    var that = this;

    //获取前，先进行accToken和userId的判断，若为空，跳转登陆页面
    var mUserInfo = wx.getStorageSync("mUserInfo");
    app.globalData.userInfo = mUserInfo;


    that.moduleChange();
    //向服务器发送请求，获取列表


    var lessionList = null;
    if (that.data.all) {
      console.log('已经到底了')
      return;
    }
    that.setData({

      //打开转圈圈
      hidden: false
    });
    var dataparam="";
    if (mUserInfo) {
      dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken + '&pageNo=' + that.data.pageNo + "&pageSize=" + that.data.pageSize;
    }else{
      dataparam = that.data.pageNo + "&pageSize=" + that.data.pageSize;
    }
    Api.fetchPost(lessionListUrl, dataparam, (err, res) => {
      try {
        var code = res.code;
      } catch (e) {
        wx.showModal({
          title: '错误',
          content: '服务端响应出现问题，点击确定重试',
          success: function(res) {
            if (res.confirm) {
              that.getData();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      if (res.code == '0') {
        //请求成功
        lessionList = res.data.lessionList;
        lessionList = that.data.postsList.concat(lessionList);

        that.setData({
          postsList: lessionList,
          //隐藏转圈圈
          hidden: true
        });

        if (res.data.total <= that.data.pageNo * that.data.pageSize) {
          that.setData({
            //列表已全部加载，没有下一页了
            all: true
          })
        } else {
          that.setData({

            pageNo: that.data.pageNo + 1
          })

        }

      } else {
        //请求失败，可能是用户登陆失效，跳转用户登陆界面
        wx.switchTab({
          url: '../index/index',
        })

      }
    })

  },
  onTapTag: function(e) {
    app.onTapTag(e)
  },

  // 滑动底部加载
  lower: function() {
    console.log('滑动底部加载', new Date());
    this.getData();
  },
  jumpToLogin: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })


  }
})