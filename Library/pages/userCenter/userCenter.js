// pages/userCenter/userCenter.js（“用户中心”页面）
const app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    balance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 在得到用户授权的情况下，获取用户信息（如头像、昵称等）
   */
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 监听按钮，并进行页面跳转
   */
  userInfo: function(){
    wx.navigateTo({
      url: '../userInfo/userInfo'
    })
  },
  mypublish: function () {
    wx.navigateTo({
      url: '../mypublish/mypublish?nickname=' + this.data.userInfo.nickName
    })
  },
  mysell: function () {
    wx.navigateTo({
      url: '../mysell/mysell?nickname='+this.data.userInfo.nickName
    })
  },
  mybuy: function () {
    wx.navigateTo({
      url: '../mybuy/mybuy?nickname=' + this.data.userInfo.nickName
    })
  },
  about: function () {
    wx.navigateTo({
      url: '../about/about'
    })
  }
})
