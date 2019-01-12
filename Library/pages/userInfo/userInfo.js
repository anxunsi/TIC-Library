// pages/userInfo/userInfo.js（“用户信息”页面）
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    gender: 0,
    selection: ['男', '女', '其他'],
    birthday: '1970-01-01',
    introduce: '',
    phone: '',
    address: '',
    exist: false,
    todate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var time = new Date()
    var date = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()

    that.setData({
      todate: date
    })
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

    wx.showLoading({
      title: '加载用户信息中'
    })

    that.getUserInfo()
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
   * 加载用户信息
   */
  getUserInfo: function () {
    //获取用户openid
    wx.cloud.callFunction({
      name: 'login',
      success: res => {

        //获取用户信息
        const db = wx.cloud.database();
        db.collection('userInfo').where({
          _openid: res.result.openid
        }).get().then(res => {
          wx.hideLoading()

          if (res.data.length != 0) {
            this.setData({
              id: res.data[0]._id,
              exist: true,
              gender: res.data[0].gender,
              birthday: res.data[0].birthday,
              introduce: res.data[0].introduce,
              phone: res.data[0].phone,
              address: res.data[0].address,
            })

            wx.showToast({
              icon: 'success',
              title: '获取信息成功'
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '用户信息不存在，请设置信息'
            })
          }
        })
      },
      fail: err => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '获取信息失败，请重试'
        })
      }
    })
  },

  /**
   * 监听并改变文本值
   */
  changeGender: function (e) {
    console.log(e.detail.value)
    this.setData({
      gender: e.detail.value
    })
  },
  changeBirthday: function (e) {
    console.log(e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },
  changeIntroduce: function (e) {
    console.log(e.detail.value)
    if (e.detail.value != '') {
      this.setData({
        introduce: e.detail.value
      })
    }
  },
  changePhone: function (e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      this.setData({
        phone: e.detail.value
      })
    }
  },
  changeAddress: function (e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      this.setData({
        address: e.detail.value
      })
    }
  },

  /**
   * 保存用户信息操作
   */
  savebtn: function () {
    var id = this.data.id
    var gender = this.data.gender
    var birthday = this.data.birthday
    var introduce = this.data.introduce
    var phone = this.data.phone
    var address = this.data.address
    var exist = this.data.exist
    var phonereg = /^1[345789]\d{9}$/

    console.log('birthday',birthday)

    wx.showLoading({
      title: '保存用户信息中'
    })

    if (phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    } else if (!phonereg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    } else if (phone.length < 11) {
      wx.showToast({
        title: '手机号位数不正确',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    } else {
      const db = wx.cloud.database()

      //若用户信息已存在，则更新用户信息；否则，添加用户信息
      if (exist) {
        db.collection('userInfo').doc(id).update({
          data: {
            gender: gender,
            birthday: birthday,
            introduce: introduce,
            phone: phone,
            address: address
          },
          success: res => {
            console.log('res',res)
            console.log('res', res)
            wx.hideLoading()

            wx.showToast({
              icon: 'success',
              title: '修改成功'
            })
          },
          fail: res => {
            wx.hideLoading()

            wx.showToast({
              icon: 'none',
              title: '修改失败'
            })
          }
        })
      } else {
        db.collection('userInfo').add({
          data: {
            gender: gender,
            birthday: birthday,
            introduce: introduce,
            phone: phone,
            address: address
          },
          success: res => {
            wx.hideLoading()

            wx.showToast({
              icon: 'success',
              title: '添加成功'
            })
          },
          fail: res => {
            wx.hideLoading()

            wx.showToast({
              icon: 'none',
              title: '添加失败'
            })
          }
        })
      }

      wx.navigateBack({
        delta: 1,
      })
    }
  }
})