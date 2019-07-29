// pages/search/search.js（“搜索书籍”页面）
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['类型', '评价'],//分类
    tab: [true, true],
    typeList: [{ 'id': '0', 'title': '综合' }, { 'id': '1', 'title': '文学小说' }, { 'id': '2', 'title': '经管励志' }, { 'id': '3', 'title': '人文社科' }, { 'id': '4', 'title': '科技科普' }, { 'id': '5', 'title': '生活艺术' }],
    type_id: 0,//类型
    type_txt: '',
    commentList: [{ 'id': '0', 'title': '不限' }, { 'id': '1', 'title': '从高到低' }, { 'id': '2', 'title': '从低到高' }],
    comment_id: 0,//评价
    comment_txt: '',


    dataList: []
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
   * 选项卡
   */
  filterTab: function (e) {
    var data = [true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },

  /**
   * 筛选项点击操作
   */
  filter: function (e) {
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true],
          tabTxt: tabTxt,
          type_id: id,
          type_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true],
          tabTxt: tabTxt,
          price_id: id,
          price_txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true],
          tabTxt: tabTxt,
          comment_id: id,
          comment_txt: txt
        });
        break;
    }

    //按标签筛选数据（没做）
    self.getDataList();
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
   * 搜索图书
   */
  searchBook: function(e) {
    console.log(e.detail.value)
    var that = this

    const db = wx.cloud.database()
    db.collection('publish').where({
      'bookInfo.title': db.RegExp({
        regexp: e.detail.value,
        options: 'i'
      })
    }).get({
      success: res => {
        that.setData({
          dataList: res.data
        })
      },
      fail: res => {
        console.log('fail')
      }
    })
  }
})
