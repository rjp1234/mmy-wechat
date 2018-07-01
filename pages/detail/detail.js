// posts.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
const app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
//var tempFilePath = null;
Page({
  data: {
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


    completeHidden:true,
    studioSrc: null, //学生录音的url
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
    speed:1

  },
  onShow: function() {

    var mUserInfo = wx.getStorageSync("mUserInfo");
    if (!mUserInfo) {
      wx.switchTab({
        url: '../index/index'
      })
    }

  },

  onLoad: function(options) {
    this.audioCtx1 = wx.createAudioContext('myAudio1')
    this.audioCtx2 = wx.createAudioContext('myAudio2')
    console.log("onload")
    //navigator 跳转传递的参数传送到这里
    this.fetchData(options.id);
    if (options.id) {
      this.setData({
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
        type: false
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
   * 点击背诵按钮触发
   */
  recite: function() {
    var that = this;
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
      //开始录音
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
        })
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
        })
        
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
    console.log("开始上传录音")
    /**
     * 这里是上传录音文件至远端服务器的方法
     * start
     */
    var ApiUrl = Api.studioUpload;
    var mUserInfo = wx.getStorageSync("mUserInfo");
    var studioType = '';
    var lessionId=that.data.lessionId;
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
  stayPage:function(){
    var that=this;
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
  jump:function(){
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
   * 播放当前录音
   */
  voicePlay: function() {
    var that = this;
    if (!that.data.voiceState) {
      //第一次点击开始播放

      innerAudioContext.autoplay = true
      innerAudioContext.src = that.data.studioSrc,
        console.log(innerAudioContext.src)
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })

      console.log('voice set logo');
      that.setData({
        //将图标设置成正在播放的样式
        voice_logo: '/images/icon/voice2.jpg',
        voiceState: true

      })

    } else {
      //第二次点击暂停播放
      wx.stopVoice();
      console.log('voice set logo')
      that.setData({
        //将图标设置成正在播放的样式
        voice_logo: '/images/icon/voice1.jpg',
        voiceState: false

      })
      innerAudioContext.onPause(() => {
        console.log('结束播放')
      })

    }
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
    var ApiUrl = Api.lessionForm;
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
    if (!mUserInfo) {
      wx.switchTab({
        url: '../index/index'
      })
    }

    var dataparam = 'userId=' + mUserInfo.userId + '&accToken=' + mUserInfo.accToken + '&lessionId=' + that.data.lessionId;
    Api.fetchPost(ApiUrl, dataparam, (err, res) => {

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
  audioPlay1: function () {
    this.audioCtx1.play()
    this.setData({
      isOpen1: true
    })
  },
  audioPause1: function () {
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
  audioSeek1: function (currentTime) {
    this.audioCtx1.seek(currentTime / 100)
  },
  formatSeconds1(s) {
    var that=this;
    var time = Math.floor(s / 60) + "分" + Math.floor(s - Math.floor(s / 60) * 60) + "秒";
    console.log( "1、"+time)
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
  },
  audioPause2: function () {
    this.audioCtx2.pause()
    this.setData({
      isOpen2: false
    })
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
    var that=this;
    var time = Math.floor(s / 60) + "分" + Math.floor(s - Math.floor(s / 60) * 60) + "秒";
    console.log(time)
    that.setData({

      result2: time

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
  }
  ,
  back:function(){

    wx.switchTab({
      url: '../topics/topics',
    })

  }

})