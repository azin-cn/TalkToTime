import {throttle} from '../../utils/debounce'
import { redirectToLogin } from '../../utils/wechat/router'
import { checkUser } from '../../utils/wechat/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '迪丽热巴',
    avatar_url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019fb65925bc32a801216a3ef77f7b.png%401280w_1l_2o_100sh.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655873803&t=85b8cb4ca13d584ca51278c9a0836ec9',
    join_date: 12,
    gender: 0,
    horoscope: '双鱼座',
    self_introduction: '去编辑个人资料完善个人简介吧',

    approval_num: 16,
    fav_num: 16,
    comment_num: 16,

    nav_titles: ['足迹', '帖子', '赞/收藏', '个性海报'],
    nav_index: 0,

    scroll_top_for_nav: [0,0,0,0], /* 保存每个Nav对应的状态 */

  },

  onLoad(options) {
    const data = checkUser()
    if(!data.registered) {
      redirectToLogin({...data})
    }
  },
  
  onPageScroll: throttle(function (e) {
    const {scrollTop:top} = e
    const {nav_index, scroll_top_for_nav} = this.data
    let scroll_top_for_nav_c = scroll_top_for_nav.map((item, index) => {
      return index == nav_index ? top : item
    })
    this.setData({
      scroll_top_for_nav: scroll_top_for_nav_c
    })
  }, 30),

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const {nav_index} = this.data
    console.log('上拉加载更多：nav_index=', nav_index)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  handleEdit() {
    console.log('handleEdit')
  },

  onTapNav(e) {
    const {navIndex} = e.target?.dataset;
    if(navIndex===undefined) return ; // 判断undefined，注意 0 情况
    
    const {scroll_top_for_nav} = this.data
    this.setData({
      nav_index: navIndex
    })
    /* 跳转原有位置 */
    wx.pageScrollTo({
      scrollTop: scroll_top_for_nav[navIndex],
      duration: 300
    });
      
  },
  
  onShowMore() {
    console.log('onShowMore')
  }
})