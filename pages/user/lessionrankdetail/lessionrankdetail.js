// pages/user/lessionrankdetail/lessionrankdetail.js
import * as echarts from '../../../ec-canvas/echarts';
var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp();
var rankListVar = [];
var curViewUser = null;
var curPage;
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

function chartClick(e) {
  console.log('chartClick')
  if (e == null) {
    return curViewUser;
  }
  var that = this;
  var index = e.dataIndex;
  curViewUser = rankListVar[index];
  return curViewUser;
}

function setOption(chart, rankList) {
  rankListVar = rankList;
  var nameLabel = [];
  var pointList = [];
  for (var i = 0; i < rankList.length; i++) {
    nameLabel.push("第" + (i + 1) + "名：" + rankList[i].userName);
    pointList.push(rankList[i].point);
  }
  var option = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [{
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }],
    yAxis: [{
      type: 'category',
      axisTick: {
        show: true
      },
      inverse: true,
      data: nameLabel,
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        interval: 0,
        color: '#666'
      }

    }],
    series: [{
        clickable: true,
        name: '热度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'

          }
        },
        data: pointList,

      }

    ]
  };
  chart.on('click', chartClick);
  chart.setOption(option);


};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    lessionId: '',
    rankList: [],
    studio: null,

    lession: null,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var lessionId = options.lessionId;
    this.setData({
      lessionId: lessionId

    });


  },
  


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    this.getData();
  },
  init: function() {
    var that = this;
    that.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      that.chart = chart;



      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });


  },
  /**
   * 长按查看当前用户的录音信息
   */
  viewStudio: function() {
   // console.log(chartClick(null));
    
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

        that.ecComponent.init((canvas, width, height) => {
          // 获取组件的 canvas、width、height 后的回调函数
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          setOption(chart, that.data.rankList);

          // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          that.chart = chart;



          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        });



      } else {
        //请求失败，可能是用户登陆失效，跳转用户登陆界面
        wx.switchTab({
          url: '/pages/index/index',
        })

      }
    })

  }
})