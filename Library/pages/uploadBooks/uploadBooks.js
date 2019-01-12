// pages/uploadBooks/uploadBooks.js（“发布”页面）
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn: '',
    bookInfo: '',
    bookSale: 0,
    bookNumber: 0,
    saler: '',
    imageID: '',

    filePath: '',
    src: [],
    isSrc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取图书ISBN
    var control = false
    var that = this
    that.setData({
      isbn: options.isbn
    })

    if (app.globalData.userInfo.nickName == 'undefined')
    {
      wx.showToast({
        title: '没有获得用户授权，无法发布',
        icon: 'fail',
        duration: 2000
      })
      wx.navigateBack({
        delta: 1,
      })
    } else {
      that.setData({
        saler: app.globalData.userInfo.nickName
      })

      wx.showLoading({
        title: '加载图书信息中',
      })

      //从豆瓣API拿到图书数据
      wx.request({
        url: 'https://douban.uieee.com/v2/book/isbn/' + this.data.isbn,
        header: {
          'Content-Type': 'json'
        },
        success: function (res) {
          wx.hideLoading()

          if (res.data.msg == "book_not_found") {
            control = true

            wx.showToast({
              title: '没有此图书信息',
              icon: 'false',
              duration: 2000,
              mask: true
            })
          } else {
            console.log('information:',res.data)

            that.setData({
              bookInfo: res.data,
            })

            console.log('book', that.data.bookInfo)
          }
        },
        fail: function () {
          wx.hideLoading()

          control = true

          wx.showToast({
            title: '信息加载失败，请重试',
            icon: 'false',
            duration: 2000,
            mask: true
          })
        },
        complete: function () {
        }
      })

      if (control) {
        wx.navigateBack({
          delta: 1,
        })
      }
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
   * 修改图书信息
   */
  changeBookSale: function (e) {
    console.log(e.detail.value)
    this.setData({
      bookSale: e.detail.value
    })
  },
  changeBookNumber: function (e) {
    console.log(e.detail.value)
    this.setData({
      bookNumber: e.detail.value
    })
  },

  /**
   * 选择图片
   */
  uploadPic: function () {
    var that = this

    wx.showModal({
      title: '提示',
      content: '上传图片需要消耗流量，是否继续？',
      confirmText: '继续',
      
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

              that.setData({
                filePath: res.tempFilePaths[0]
              })

              that.setData({
                isSrc: true,
                src: res.tempFilePaths[0]
              })
            }
          })
        }
      }
    })
  },

  /**
   * 删除图片
   */
  clearPic: function () {//删除图片
    this.setData({
      isSrc: false,
      src: ""
    })
  },

  /**
   * 上传图书数据到发布数据库，并上传图书实物图片到云储存
   */
  publish:function(){
    var that = this
    var filePath = that.data.filePath
    var bookreg = /^[0-9]*$/
    var time = new Date()
    var date = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    var cloudPath = that.data.saler + '/' + that.data.isbn + date + filePath.match(/\.[^.]+?$/)[0]

    if (that.data.bookSale == '') {
      wx.showToast({
        title: '出售价格错误，请重新输入',
        icon: 'none'
      })
    } else if (that.data.bookSale <= 0) {
      wx.showToast({
        title: '出售价格错误，请重新输入',
        icon: 'none'
      })
    } else if (!bookreg.test(that.data.bookSale)) {
      wx.showToast({
        title: '出售价格错误，请重新输入',
        icon: 'none'
      })
    } else if (that.data.bookNumber == '') {
      wx.showToast({
        title: '出售数量错误，请重新输入',
        icon: 'none'
      })
    } else if (that.data.bookNumber <= 0) {
      wx.showToast({
        title: '出售数量错误，请重新输入',
        icon: 'none'
      })
    } else if (!bookreg.test(that.data.bookNumber)) {
      wx.showToast({
        title: '出售数量错误，请重新输入',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '发布中',
      })

      //上传拍照的图书实物图片
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res)

          that.setData({
            imageID: res.fileID
          })

          console.log('imageID', that.data.imageID)

          //上传图书数据
          const db = wx.cloud.database()
          db.collection('publish').add({
            data: {
              bookInfo: that.data.bookInfo,
              bookSale: that.data.bookSale,
              bookNumber: that.data.bookNumber,
              saler: that.data.saler,
              date: date,
              imageID: that.data.imageID
            },
            success: res => {
              wx.hideLoading()
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 2000,
                mask: true
              })
            },
            fail: res => {
              wx.hideLoading()
              wx.showToast({
                title: '发布失败',
                icon: 'fail',
                duration: 2000,
                mask: true
              })
            }
          })
        },
        fail: e => {
        },
        complete: () => {
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    }
  }
})