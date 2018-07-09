var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var app = getApp()
var navList = [{
  id:"lession",
  title: "课文列表"
},{
  id:"score",
  title:"我的成绩"
},{
  id:'record',
  title:"我的记录"

}

];

Page({
  data: {
    activeIndex: 0,
    navList: navList,
    postsList: [],
    hidden: false,
    pageNo: 1,
    pageSize: 20,
    all: false

  },
  onShow:function(){
    var mUserInfo=wx.getStorageSync("mUserInfo");
    if(!mUserInfo){
      wx.switchTab({
        url: '../index/index'
      })
    }
    this.setData({
      pageNo: 1,
      pageSize: 20,
      postsList: [],
      all: false

    })
    this.getData();
  },
  onLoad: function () {
   
  },

  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1,
      pageSize: 20,
      postsList: [],
      all: false

    })

    this.getData();
    console.log('下拉刷新', new Date());
  },


  onReachBottom: function () {
    this.lower();
    console.log('上拉刷新', new Date());
  },

  //获取文章列表数据
  getData: function () {
    //获取前，先进行accToken和userId的判断，若为空，跳转登陆页面
    var mUserInfo = wx.getStorageSync("mUserInfo");
    app.globalData.userInfo = mUserInfo;

    var that = this;

    if (!mUserInfo) {
      wx.switchTab({
        url: '../index/index'
      })
    }
    //向服务器发送请求，获取列表

    var ApiUrl = Api.lessionList;
    var lessionList = null;
    if (that.data.all) {
      console.log('已经到底了')
      return;
    }

    var dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken + '&pageNo=' + that.data.pageNo + "&pageSize=" + that.data.pageSize;
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {

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
  onTapTag:function(e){
    console.log(e);
    var id=e.target.id;
    if("lession"==id){
      wx.switchTab({
        url: '../topics/topics',
      })

    }else if ('score'==id){
      wx.navigateTo({
        url: '/pages/user/userRankDetail/userRankDetail'
      })
    }else if('record'==id){
      wx.navigateTo({
        url: '/pages/user/pointrecord/pointrecord'
      })

    }


  },

  // 滑动底部加载
  lower: function () {
    console.log('滑动底部加载', new Date());
    this.getData()
  }

})