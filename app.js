//app.js
App({
  globalData: {
    userInfo: null,
    navList: [{
        id: "lession",
        title: "首页"
      }, {
        id: 'record',
        title: "我的记录"
      }, {

        id: "score",
        title: "成绩单"
      }

    ]
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


  }
})