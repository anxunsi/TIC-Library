// pages/publish/publish.js（“扫码”页面）
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 扫描条形码、二维码
   */
  scanbtn : function(){
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: function(res) {
        if (res.scanType == 'EAN_13') {
          console.log("结果:" + res.result + "码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path)

          wx.navigateTo({
            url: '../uploadBooks/uploadBooks?isbn=' + res.result
          })
        } else {
          wx.showToast({
            title: '条形码有误',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '扫描失败',
          icon: 'success',
          duration: 2000,
          mask: true
        })
      }
    })
  }
})