//index.js（“首页”页面）
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    tabList: [{ 'id': '0', 'title': '推荐' }, { 'id': '1', 'title': '文学小说' }, { 'id': '2', 'title': '经管励志' }, { 'id': '3', 'title': '人文社科' }, { 'id': '4', 'title': '科技科普' }, { 'id': '5', 'title': '生活艺术' }],
    
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;

        that.setData({
          winHeight: calc
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    wx.showLoading({
      title: '图书信息加载中',
    })

    that.getDataList()
  },

  /**
   * 加载数据
   */
  getDataList: function () {
    var that = this

    const db = wx.cloud.database()
    db.collection('publish').get().then(res => {
      that.setData({
        dataList: res.data
      })

      wx.hideLoading()
    }).catch(err => {
        console.error(err)
    })

  },

  /**
   * 滚动切换标签样式
   */
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },

  /**
   * 点击标题切换当前页时改变样式
   */
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },

  /**
   * 判断当前滚动超过一屏时，设置tab标题滚动条
   */
  checkCor: function () {
    if (this.data.currentTab >= 4) {
      this.setData({
        scrollLeft: "500rpx"
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  /**
   * 跳转界面
   */
  search_click:function(){
    wx.navigateTo({
      url: '../search/search'
    })
  }
})
