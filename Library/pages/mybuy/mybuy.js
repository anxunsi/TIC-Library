// pages/mybuy/mybuy.js（“我的购买”页面）
Page({

  /**
   * 页面的初始数据
   */
  data: {
    control: true,
    dataList: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    if (options.nickname == 'undefined') {
      that.setData({
        control: false
      })

      wx.showToast({
        title: '没有获得用户授权，无法显示相关信息',
        icon: 'none',
        duration: 2000
      })

      setTimeout(function () {
        wx.navigateBack({
          delta: 1,
        })
      }, 2000)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this

    if (that.data.control) {
      wx.showLoading({
        title: '信息加载中',
      })

      that.getDataList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 评价
   */
  ordercomment:function(){
    wx.showToast({
      icon: 'none',
      title: '评价功能暂未开放',
    })
  },

  /**
   * 加载数据
   */
  getDataList: function () {
    var that = this

    const db = wx.cloud.database();
    db.collection('buy').get().then(res => {
      that.setData({
        dataList: res.data
      })

      wx.hideLoading()
    })
  }
})