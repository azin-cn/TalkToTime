// pages/index/index.js
const TIME = 600
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: ["笔记", "社区", 'Let\'s go'],
    show_to_top: false,
    scroll_top: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  onTapIcon() {
    const {show_to_top} = this.data
    if(show_to_top) {
      this.setData({
        show_to_top: false,
        scroll_top: 0
      })
      return ;
    } 
    
    /* 刷新部分 */
    this.Note = this.selectComponent('#Note')
    this.Note.onRefresh()
  },

  onShowToTop(e) {
    const {show_to_top} = e.detail
    this.setData({show_to_top})
  }
})