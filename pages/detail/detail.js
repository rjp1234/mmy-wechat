// posts.jsDDrenjianping
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
const app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext("myAudio3");
var lessionFormUrl = Api.lessionForm;
//var tempFilePath = null;
Page({
  data: {
    fontSize: 120,
    //示范录音播放器配置
    currentTime1: 0,
    duration1: 0,
    result1: '0分0秒',
    isOpen1: false,
    //老师的话播放器配置
    currentTime2: 0,
    duration2: 0,
    result2: '0分0秒',
    isOpen2: false,
    //学生录制播放器配置
    currentTime3: 0,
    duration3: 0,
    result3: '0分0秒',
    isOpen3: false,



    completeHidden: true,
    studioSrc: null, //学生录音的urlD
    lessionId: '',
    hidden: false,
    detail: null,
    author: '',
    contentHidden: false,
    exampleHidden: false,
    tContentHidden: false,
    tStudioHidden: false,
    readHidden: false,
    reciteHidden: false,
    read: "朗读模式",
    recite: "背诵模式",
    readState: true,
    reciteState: true,
    studioHidden: true,
    studio_logo: '/images/icon/studio1.jpg',
    voice_logo: '/images/icon/voice1.jpg',
    studioState: false, //录音状态:false、开始录音 。true、结束录音。
    voiceState: false, //播放本地录音 false.开始播放。true、结束播放
    modalHidden: true, //确认录音上传的弹窗提示
    type: false, //背诵&朗读 朗读=false 背诵=true
    speed: 1,

    studioUpload: false //录音上传时显示转圈圈

  },
  /**
   * 模式切换
   */
  moduleChange: function() {
      var url;
      var that = this;
      var mUserInfo = wx.getStorageSync("mUserInfo");
      if (!mUserInfo) {
        url = Api.touristLessionForm;
      } else {
        url = Api.lessionForm;

      }
      lessionFormUrl = url;

    }


    ,
  /**
   * 生命周期函数--监听页面卸载/
   */
  onUnload: function() {
    console.log("onUnload");
    //页面隐藏时关闭所有音频
    var that = this;
    that.audioPause1();
    that.audioPause2();
    that.audioPause3();

  },

  onHide: function() {
    console.log("onhide");
    //页面隐藏时关闭所有音频
    var that = this;
    that.audioPause1();
    that.audioPause2();
    that.audioPause3();

  },
  onShow: function() {
    this.moduleChange();


  },
  viewRanking: function() {
    var that = this;
    var jumpUrl = "/pages/user/lessionrankdetail/lessionrankdetail?lessionId=" + that.data.detail.id;
    console.log(jumpUrl)
    wx.navigateTo({
      url: jumpUrl


    });
  },
  onLoad: function(options) {

    var that = this;
    that.audioCtx1 = wx.createAudioContext('myAudio1')
    that.audioCtx2 = wx.createAudioContext('myAudio2')

    that.moduleChange();
    //navigator 跳转传递的参数传送到这里
    that.fetchData(options.id);
    if (options.id) {
      that.setData({
        lessionId: options.id
      })
    }
  },
  /**
   * 页面调整函数 start
   */

  //点击朗读按钮是触发
  read: function() {
    var that = this;
    if (that.data.readState) {
      //第一次点击时，进入朗读模式，触发以下事件
      that.setData({
        exampleHidden: true,
        tStudioHidden: true,
        reciteHidden: true,
        studioHidden: false,
        read: "朗读模式结束",
        readState: false,
        type: false,

      })
    } else {
      //第二次点击时，取消朗读
      that.setData({
        contentHidden: false,
        exampleHidden: false,
        tStudioHidden: false,
        reciteHidden: false,
        studioHidden: true,
        read: "朗读模式",
        readState: true

      });
      if (that.data.studioSrc != null) {
        that.setData({
          modalHidden: false
        })
      }
    }
  },
  /**
   * 点击字体放大
   */
  fontBigger: function() {
    var that = this;
    console.log(that.data.fontSize)
    if (that.data.fontSize > 200) {
      return;
    }
    that.setData({
      fontSize: that.data.fontSize + 20
    })


  },
  /**
   * 点击字体变小
   */
  fontSmaller: function() {
    var that = this;
    console.log(that.data.fontSize)
    if (that.data.fontSize < 50) {
      return;
    }
    that.setData({
      fontSize: that.data.fontSize - 20
    })

  },


  /**
   * 点击背诵按钮触发
   */
  recite: function() {
    var that = this;
    var mUserInfo = wx.getStorageSync("mUserInfo");
    if (!mUserInfo) {
      //没有用户数据，提醒用户进行登录操作
      wx.showModal({
        title: '请登录',
        content: '使用背诵功能需要你的个人信息以同步你之前的数据，点击确定跳转登录界面',
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            });
          }
        }
      })
      return;


    }


    var studioSrc = wx.getStorageSync("studioSrc" + that.data.detail.id);
    if (studioSrc) {
      that.setData({
        studioSrc: studioSrc
      })
    }


    that.audioPause1();
    that.audioPause2();

    if (that.data.reciteState) {
      that.setData({
        exampleHidden: true,
        contentHidden: true,
        tContentHidden: true,
        tStudioHidden: true,
        readHidden: true,
        studioHidden: false,
        recite: "背诵模式结束",
        reciteState: false,
        type: true
      })
    } else {
      //第二次点击时，取消背诵
      that.setData({
        exampleHidden: false,
        tStudioHidden: false,
        readHidden: false,
        contentHidden: false,
        tContentHidden: false,
        tStudioHidden: false,
        studioHidden: true,
        recite: "背诵模式",
        reciteState: true
      });
      if (that.data.studioSrc != null) {
        that.setData({
          modalHidden: false
        })
      }

    }
  },
  studioRecord: function() {
    var that = this;
    var state = that.data.studioState;
    if (!state) {
      //stop audio before studioRecord
      that.audioPause1();
      that.audioPause2();
      that.audioPause3();
      //开始录音
      //清空上一轮录音保存
      that.setData({
        studioSrc: null
      });
      //将录音存放在缓存中
      wx.removeStorageSync("studioSrc" + that.data.detail.id, that.data.studioSrc);
      that.setData({
        studioState: true,
        studio_logo: '/images/icon/studio2.jpg'
      })
      if (that.data.read == "朗读模式结束") {
        //朗读模式
        that.setData({
          readHidden: true
        })

      } else {
        //背诵模式，隐藏朗读模式按钮
        that.setData({
          reciteHidden: true
        });



      }
      /**
       * 
       * 这里填写录音开始的代码
       * 
       */

      const options = {
        duration: 600000, //指定录音的时长，单位 ms
        sampleRate: 16000, //采样率
        numberOfChannels: 1, //录音通道数
        encodeBitRate: 96000, //编码码率
        format: 'mp3', //音频格式，有效值 aac/mp3
        frameSize: 50, //指定帧大小，单位 KB
      }
      //开始录音
      recorderManager.start(options);
      recorderManager.onStart(() => {
        console.log('recorder start')
      });
      //错误回调
      recorderManager.onError((res) => {
        console.log(res);
      })



    } else {
      //结束录音
      that.setData({
        studioState: false,
        studio_logo: '/images/icon/studio1.jpg',
      })
      if (that.data.read == "朗读模式结束") {
        //朗读模式
        that.setData({
          readHidden: false
        })

      } else {
        //背诵模式，隐藏朗读模式按钮
        that.setData({
          reciteHidden: false
        })
      }
      /**
       * 这里填写录音结束 并存储的代码
       * 
       */

      recorderManager.stop();
      recorderManager.onStop((res) => {
        that.setData({
          studioSrc: res.tempFilePath
        });
        //将录音存放在缓存中
        wx.setStorageSync("studioSrc" + that.data.detail.id, that.data.studioSrc);

        console.log('停止录音', res.tempFilePath)
      })

    }
  },
  /**
   * 上传当前录音
   */
  upload: function() {
    var that = this;
    that.setData({
      modalHidden: true
    });
    console.log("开始上传录音");
    that.setData({
      studioUpload: true
    })
    /**
     * 这里是上传录音文件至远端服务器的方法
     * start
     */
    var ApiUrl = Api.studioUpload;
    var mUserInfo = wx.getStorageSync("mUserInfo");
    var studioType = '';
    var lessionId = that.data.lessionId;
    if (!that.data.type) {
      studioType = '0'
    } else {
      studioType = '1';
    }
    wx.uploadFile({
      url: ApiUrl,
      filePath: that.data.studioSrc,
      name: 'file',
      formData: {
        userId: mUserInfo.userId,
        accToken: mUserInfo.accToken,
        lessionId: that.data.lessionId,
        type: 1
      },
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function(res) {
        var str = res.data;
        var data = JSON.parse(str);
        if (data.code == '0') {
          console.log('上传成功');
          //如果之前有一次成功完成的记录，那么算上本次就全部完成了
          //if (that.data.detail.readState || that.data.detail.reciteState) {
          //弹出选择，留在本页还是跳转列表页面
          that.setData({
            completeHidden: false
          })
          //  }
          console.log("that.data.lesssionId" + lessionId)
          //上传录音伴随着状态改变，需要重新加载页面
          that.fetchData(lessionId);
          //上传成功后清除本地studio的信息
          that.setData({
            studioSrc: null
          })
          wx.removeStorage({
            key: 'studioSrc' + lessionId,
            success: function(res) {
              console.log("清理缓存成功" + res)

            },
          })

        } else {
          wx.showModal({
            title: '提示',
            content: data.message,
            showCancel: false,
            success: function(res) {

            }
          });
        }
        wx.hideToast();
        that.setData({
          studioUpload: false
        })
      },
      fail: function(res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: "网络请求失败，请确保网络是否正常",
          showCancel: false,
          success: function(res) {

          }
        });
        wx.hideToast();
      }
    });

    /**
     * 这里是上传录音文件至远端服务器的方法
     *end
     */


  },
  stayPage: function() {
    var that = this;
    that.setData({
      completeHidden: true
    });
    that.setData({
      /**
       * 直接还原初始设置
       */
      studioSrc: '', //学生录音的url
      author: '',
      contentHidden: false,
      exampleHidden: false,
      tContentHidden: false,
      tStudioHidden: false,
      readHidden: false,
      reciteHidden: false,
      read: "朗读模式",
      recite: "背诵模式",
      readState: true,
      reciteState: true,
      studioHidden: true,
      studio_logo: '/images/icon/studio1.jpg',
      voice_logo: '/images/icon/voice1.jpg',
      studioState: false, //录音状态:false、开始录音 。true、结束录音。
      voiceState: false, //播放本地录音 false.开始播放。true、结束播放
      modalHidden: true //确认录音上传的弹窗提示


    });


  },
  jump: function() {
    wx.switchTab({
      url: '../topics/topics',
    })

  },

  /**
   * 取消上传当前录音
   */
  cancelUpload: function() {
    var that = this;
    that.setData({
      /**
       * 直接还原初始设置
       */

      author: '',
      contentHidden: false,
      exampleHidden: false,
      tContentHidden: false,
      tStudioHidden: false,
      readHidden: false,
      reciteHidden: false,
      read: "朗读模式",
      recite: "背诵模式",
      readState: true,
      reciteState: true,
      studioHidden: true,
      studio_logo: '/images/icon/studio1.jpg',
      voice_logo: '/images/icon/voice1.jpg',
      studioState: false, //录音状态:false、开始录音 。true、结束录音。
      voiceState: false, //播放本地录音 false.开始播放。true、结束播放
      modalHidden: true //确认录音上传的弹窗提示


    });


  },


  /**
   * 页面调整函数end
   * 
   * 
   */

  // 获取数据
  fetchData: function(id) {

    var that = this;
    that.setData({
      //隐藏转圈圈
      hidden: false
    });

    console.log(id)
    /**
     * 测试使用
     */

    that.setData({
      hidden: false,
      lessionId: id
    });
    console.log(that.data.lessionId)
    var mUserInfo = wx.getStorageSync("mUserInfo");
    app.globalData.userInfo = mUserInfo;

    var dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken + '&lessionId=' + that.data.lessionId;
    Api.fetchPost(lessionFormUrl, dataparam, (err, res) => {

      if (res.code == '0') {
        //请求成功
        var detail = res.data.detail;
        console.log(detail);
        that.setData({
          detail: detail,
          //隐藏转圈圈S
          hidden: true

        });

      }
    })
  },
  //播放器1 start
  audioPlay1: function() {
    var that = this;
    that.audioCtx1.play();
    that.setData({
      isOpen1: true
    });
    that.audioPause2();
    that.audioPause3();
  },
  audioPause1: function() {
    var that = this;
    that.audioCtx1.pause();
    that.setData({
      isOpen1: false
    })
  },
  updata1(e) {
    var that = this;
    // console.log((e.detail.currentTime / 100).toFixed(2))
    if (e.detail.duration == null) {
      return;
    }

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
  audioPlay2: function() {
    var that = this;
    that.audioCtx2.play()
    that.setData({
      isOpen2: true
    });
    that.audioPause3();
    that.audioPause1();
  },
  audioPause2: function() {
    this.audioCtx2.pause()
    this.setData({
      isOpen2: false
    })
  },
  updata2(e) {
    var that = this;
    // console.log((e.detail.currentTime / 100).toFixed(2))
    if (e.detail.duration == null) {
      return;
    }
    if (e.detail.duration == e.detail.currentTime) {
      //播放完毕调用暂停方法
      that.audioPause2();
    }
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
  audioSeek2: function(currentTime) {
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
  //播放器3 start
  audioPlay3: function() {

    console.log("audioplay3")
    var that = this;
    innerAudioContext.src = that.data.studioSrc;
    console.log('that.data.studioSrc=' + that.data.studioSrc);



    that.setData({
      isOpen3: true
    });
    innerAudioContext.onPlay((res) => {
      console.log("innerAudioContext.onPlay")
      that.updata3(that)

    });
    innerAudioContext.onEnded(() => {
      that.setStopState3(that);

    })


    innerAudioContext.play();
  },
  audioPause3: function() {
    innerAudioContext.pause()
    this.setData({
      isOpen3: false
    })
  },
  updata3(that) {
    innerAudioContext.onTimeUpdate((res) => {
      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新
      console.log("duratio的值：", innerAudioContext.duration)
      that.setData({
        duration3: innerAudioContext.duration.toFixed(2) * 100,
        currentTime3: innerAudioContext.currentTime.toFixed(2) * 100,
      })
      that.formatSeconds3(that.data.currentTime3 / 100);
    })



  },
  setStopState3: function(that) {
    that.setData({
      currentTime3: 0
    })
    this.audioPause3();

  },
  sliderChange3(e) {
    var that = this;
    var curval = e.detail.value;
    that.setData({
      currentTime3: curval
    })

    that.audioSeek3(curval);
    innerAudioContext.onSeeked((res) => {
      this.updata3(that) //注意这里要继续出发updataTime事件，
    })
  },
  audioSeek3: function(currentTime) {
    var that = this;
    console.log('audioSeek3:currentTime=' + currentTime)
    innerAudioContext.seek(currentTime / 100);
    innerAudioContext.onSeeked((res) => {
      this.updata3(that) //注意这里要继续出发updataTime事件，
    });
  },
  formatSeconds3(s) {
    var that = this;
    var time = Math.floor(s / 60) + "分" + Math.floor(s - Math.floor(s / 60) * 60) + "秒";
    console.log("1、" + time)
    that.setData({

      result3: time

    })
  },


  funerror: function(u) {
    console.log(u.detail.errMsg);
    var that = this;
    var msg = '';
    console.log(u.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED');
    if (u.detail.errMsg == 'MEDIA_ERR_NETWORD') {
      msg = '网络出错无法播放';
    } else if (u.detail.errMsg == 'MEDIA_ERR_DECODE' || u.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
      msg = '无法播放，请联系教师更换音频文件'
    }
    that.setData({
      author: msg
    })
  },
  back: function() {

    wx.switchTab({
      url: '../topics/topics',
    })

  }

})