// index/details.js（“商品详情”页面）
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    bookInfo: {},
    bookSale: 0,
    bookNumber: 0,
    number: 1,
    selection: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    saler: '',

    date: '',
    imageID: '',
    image: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    that.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this

    wx.showLoading({
      title: '加载商品信息中',
    })

    that.getGood()
  },

  /**
   * 预览图片
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var img = this.data.image;
    var imglist = [];

    for (var i = 0; i < img.length; i++) {
      imglist[i] = href + img[i].img
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imglist// 需要预览的图片http链接列表  
    })
  },

  /**
   * 加载数据
   */
  getGood: function(){
    var that = this

    const db = wx.cloud.database();
    db.collection('publish').where({
      _id: that.data.id
    }).get().then(res => {
      that.setData({
        bookInfo: res.data[0].bookInfo,
        bookSale: res.data[0].bookSale,
        bookNumber: res.data[0].bookNumber,
        saler: res.data[0].saler,
        date: res.data[0].date,
        imageID: res.data[0].imageID,

        'image[0]': res.data[0].bookInfo.image,
      })

      wx.cloud.downloadFile({
        fileID: res.data[0].imageID,
        success: res => {
          that.setData({
            'image[1]': res.tempFilePath
          })

          wx.hideLoading()
        }
      })
    })
  },

  /**
   * 购买
   */
  buy:function (e) {
    var that = this

    that.setData({
      number: e.detail.value
    })

    if (that.data.bookNumber - that.data.number < 0) {
      wx.showToast({
        title: '购买数量不正确',
        icon: 'none'
      })
    } else if (that.data.number == 0) {
      wx.showToast({
        title: '购买数量不正确',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '购买中'
      })

      //更新发布数据库
      wx.cloud.callFunction({
        name: 'update',
        data: {
          id: that.data.id,
          bookNumber: that.data.bookNumber,
          number: that.data.number,
        },
        success: res => {
          that.setData({
            bookNumber: that.data.bookNumber - that.data.number,
          })

          that.refleshSell()
          that.refleshBuy()

          wx.hideLoading()

          wx.showToast({
            title: '购买成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
        },
        fail: err => {
          wx.showToast({
            title: '购买失败',
            icon: 'fail',
            duration: 2000,
            mask: true
          })
        }
      })
    }
  },

  /**
   * 更新卖出数据库
   */
  refleshSell: function () {
    var that = this
    var time = new Date()
    var date = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()

    const db = wx.cloud.database()
    db.collection('sell').add({
      data: {
        image: that.data.bookInfo.image,
        title: that.data.bookInfo.title,
        salePrice: that.data.bookSale,
        saleNumber: that.data.number,
        saleDate: date,
        saler: that.data.saler
      }
    })
  },

  /**
   * 更新买入数据库
   */
  refleshBuy: function () {
    var that = this
    var time = new Date()
    var date = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()

    const db = wx.cloud.database()
    db.collection('buy').add({
      data: {
        image: that.data.bookInfo.image,
        title: that.data.bookInfo.title,
        buyPrice: that.data.bookSale,
        buyNumber: that.data.number,
        buyDate: date,
        saler: that.data.saler,
      }
    })
  }
})