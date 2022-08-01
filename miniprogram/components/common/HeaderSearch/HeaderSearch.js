import router from "../../../utils/wechat/router";

const app =  getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '搜索动态、话题、用户'
    },
    profile_url: {
      type: String,
      value: '/pages/profile/profile'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    input_val: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    UNSAFE__onConfirm(e) { /* 废弃 */
      // console.log(e)
      const {value} = e.detail
      console.log(value)
      
      // this.triggerEvent('onConfirm',e.detail)

      /* 清除输入框的内容 */
      this.setData({
        input_val: ''
      })
    },

    handleToSearch() {
      router.navigateToSearch()
    },

    handleToProfile() {
      router.navigateToProfile()
    }
  }
})
