import * as echarts from '../../../ec-canvas/echarts';
// posts.js
var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
const app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

var navList = app.globalData.navList;

function setOption(chart, detail) {


  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#FF9F7F", "red"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],

      data: [{
        value: detail.aNum,
        name: 'A-' + detail.aNum
      }, {
        value: detail.pNum,
        name: 'P-' + detail.pNum
      }, {
        value: detail.eNum,
        name: 'E-' + detail.eNum
      }],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowColor: 'rgba(0, 2, 2, 0.3)',
        }
      }
    }]
  };

  chart.setOption(option);

}

Page({
  data: {
    navList: navList,
    activeIndex: 2,
    hidden: false,
    detail: null,
    user: null,
    completed: 'red',
    comment: '',
    firstOne: false,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    }

  },

  onReady() {
    //该功能需要用到用户数据
    var that = this;
    var mUserInfo = wx.getStorageSync("mUserInfo");
    if (!mUserInfo) {
      //没有用户数据，提醒用户进行登录操作
      wx.showModal({
        title: '请登录',
        content: '使用该功能需要你的个人信息以同步你之前的数据，点击确定跳转登录界面',
        success: function(res) {
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
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-pie');
    this.fetchData();
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

    

  onTapTag: function(e) {
    app.onTapTag(e)


  },
  refresh: function() {
    this.fetchData();

  },
  // 获取数据
  fetchData: function() {

    var that = this;
    that.setData({
      //开始转圈圈
      hidden: false
    });
    var ApiUrl = Api.userDetail;

    /**
     * 测试使用
     */

    that.setData({
      hidden: false,
    });

    var mUserInfo = wx.getStorageSync("mUserInfo");
    app.globalData.userInfo = mUserInfo;
    if (!mUserInfo) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }


    var dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken;
    /**
    * 这里新增超时处理的方法 start
    */

    setTimeout(function () {
      var hidden = that.data.hidden
      if (hidden) {
        //加载窗口已经被隐藏
        return;

      }
      //加载窗口还未隐藏

      that.setData({
        hidden: true
      });
      //弹出超时窗口
      wx.showModal({
        title: '请求超时',
        confirmText: '刷新',
        cancelText: "返回首页",
        content: '服务器貌似失去了链接',
        success: function (res) {
          if (res.confirm) {
            that.fetchData();
          } else {
            //点击取消返回列表
            wx.switchTab({
              url: '/pages/topics/topics',
            });

          }
        }
      })
    },
      20000);

    /**
     * 这里新增超时处理的方法 end
     */
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {
      console.log(res);
      if (res.code == '0') {
        //请求成功
        var detail = res.data.userDetail;
        console.log(detail);
        that.setData({
          detail: detail,
          //隐藏转圈圈S
          hidden: true,
          completed: 'red'
        });
        //是否全部完成
        if (detail.issueNum == detail.completeNum) {
          that.setData({
            completed: 'green'
          });
        }
        //查看排名超越班级的百分之几
        var surpass = Math.ceil((detail.classmateNum - detail.ranking) / detail.classmateNum * 100)
        var comment = '';
        if (surpass >= 100) {
          comment = "恭喜你超过了班级所有的同学，成功站在了这个班级的巅峰"
          that.setData({
            firstOne: true
          })
        } else if (surpass < 100 && surpass >= 70) {
          comment = "恭喜你超过了班级" + surpass + "%的学生，成功站在了班级前列，要保持下去哟";

        } else if (surpass >= 30 && surpass < 70) {
          comment = "恭喜你超过了班级" + surpass + "%的学生,在班级中游浮沉，要更加努力了";
        } else if (rank > 0 && rank < 30) {
          comment = "恭喜你超过了班级" + surpass + "%的学生,班主任随时准备找你谈话哟"
        } else {
          comment = "获得奠基人成就"
        }
        if (!detail.lastPointTime) {
          comment = "你还未上传录音或首次上传录音还未批改O(∩_∩)O"
        }

        that.setData({
          comment: comment
        });
        that.ecComponent.init((canvas, width, height) => {
          // 获取组件的 canvas、width、height 后的回调函数
          // 在这里初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          setOption(chart, that.data.detail);

          // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          that.chart = chart;



          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        });

      }
    })
  }


})