// pages/profile/components/TraceCard/TraceCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    traces: []
  },

  lifetimes: {
    attached() {
      let trace = {
        id: Date.now(),
        title: '美丽中国,美丽中国,美丽中国',
        location: '广东省广州市天河区',
        url: 'https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF',
      }
      let traces = []
      let timer = setInterval(() => {
        traces.push({...trace, id: Date.now()})
        if(traces.length === 5) {
          clearInterval(timer)
          this.setData({traces})
        }
      }, 10);
      // 使用分段传递数据
    },
    detached() {
      // console.log('--trace card detached--')
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShowMore(e){
      console.log('onShowMore wx:navigate, id=', e.currentTarget?.dataset?.id)
    }
  }
})
