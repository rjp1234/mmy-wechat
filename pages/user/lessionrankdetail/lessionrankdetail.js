// pages/user/lessionrankdetail/lessionrankdetail.js
import * as echarts from '../../../ec-canvas/echarts';
var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp();
var curPage;
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()





Page({

  /**
   * 页面的初始数据
   */
  data: {
    //录音播放器配置 start
    currentTime1: 0,
    duration1: 0,
    result1: '0分0秒',
    isOpen1: false,
    //end
    //自己的录音播放 start
    currentTime2: 0,
    duration2: 0,
    result2: '0分0秒',
    isOpen2: false,
    //end

    user: null,
    lessionId: '',
    rankList: [],
    studio: null,
    curViewUser: null, //在图表中选择的用户

    lession: null,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    modalHidden: true,
    chartHidden:false,
    hidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.audioCtx1 = wx.createAudioContext('myAudio1');
    this.audioCtx2 = wx.createAudioContext('myAudio2');
    console.log(options)
    var lessionId = options.lessionId;
    this.setData({
      lessionId: lessionId

    });


  },
  //播放器1 start
  audioPlay1: function() {
    this.audioCtx1.play()
    this.setData({
      isOpen1: true
    })
    this.audioPause2();
  },
  audioPause1: function() {
    this.audioCtx1.pause()
    this.setData({
      isOpen1: false
    })

  },
  updata1(e) {
    var that = this;
    // console.log((e.detail.currentTime / 100).toFixed(2))
    let duration = e.detail.duration.toFixed(2) * 100,
      currentTime = e.detail.currentTime.toFixed(2) * 100;
    that.setData({
      duration1: duration,
      currentTime1: currentTime
    })
    console.log('updata1')
    that.formatSeconds1(currentTime / 100);
  },
  sliderChange1(e) {
    var that = this
    that.setData({
      currentTime1: e.detail.value
    })
    that.audioSeek1(e.detail.value)
  },
  audioSeek1: function(currentTime) {
    this.audioCtx1.seek(currentTime / 100)
  },
  formatSeconds1(s) {
    var that = this;
    var time = Math.floor(s / 60) + "分" + Math.floor(s - Math.floor(s / 60) * 60) + "秒";
    console.log("1、" + time)
    that.setData({

      result1: time

    })
  },
  //播放器2 start
  audioPlay2: function () {
    this.audioCtx2.play()
    this.setData({
      isOpen2: true
    })
    this.audioPause1();
  },
  audioPause2: function () {
    this.audioCtx2.pause()
    this.setData({
      isOpen2: false
    });

  },
  updata2(e) {
    var that = this;
    // console.log((e.detail.currentTime / 100).toFixed(2))
    let duration = e.detail.duration.toFixed(2) * 100,
      currentTime = e.detail.currentTime.toFixed(2) * 100;
    that.setData({
      duration2: duration,
      currentTime2: currentTime
    })
    that.formatSeconds2(currentTime / 100);
  },
  sliderChange2(e) {
    var that = this
    that.setData({
      currentTime2: e.detail.value
    })
    that.audioSeek2(e.detail.value)
  },
  audioSeek2: function (currentTime) {
    this.audioCtx2.seek(currentTime / 100)
  },
  formatSeconds2(s) {
    var that = this;
    var time = Math.floor(s / 60) + "分" + Math.floor(s - Math.floor(s / 60) * 60) + "秒";
    console.log(time)
    that.setData({

      result2: time

    })
  },
  /**
   * end
   */

 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    this.getData();
  },

  /**
   * 查看当前用户的录音信息（点击图表后触发）
   */
  viewStudio: function(e) {
    var that = this;
    var index = e.dataIndex;
    

    //弹出弹框
    that.setData({
      modalHidden: false,
      curViewUser: that.data.rankList[index],
      chartHidden:true
    })

  },

  cancel: function() {
    console.log('cancel')
    var that = this;
    //停止播放
    that.audioPause1();
   
    //关闭弹框
    that.setData({
      modalHidden: true,
      chartHidden: false

    })

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
  /**
   * 图表设置
   */
  setOption: function(chart) {
    var that = this;
    var rankList = that.data.rankList;
    var nameLabel = [];
    var pointList = [];
    for (var i = 0; i < 10; i++) {
      if (i < rankList.length) {
        nameLabel.push("第" + (i + 1) + "名：" + rankList[i].userName);
        pointList.push(rankList[i].point);
      } else {
        nameLabel.push("第" + (i + 1) + "名：空缺中");
        pointList.push(0);

      }
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
    chart.on('click', this.viewStudio);
    chart.setOption(option);


  },
  /**
   * 图表初始化
   */
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
        console.log(studio)

        that.ecComponent.init((canvas, width, height) => {
          // 获取组件的 canvas、width、height 后的回调函数
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          that.setOption(chart);

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