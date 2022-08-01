import { getSettingScopes } from "../../utils/getSettingScope";

Page({
  data: {
    tips: "轻触拍照，长按摄像",
    isPress: false,
    imageSrc: "", //图片url
    videoSrc: "", //视频url
    startTime: 0,
    endTime: 0,

    currentTime: 0,
    max_duration: 10,
  },

  onLoad() {
    this.camera = wx.createCameraContext();
  },

  onTapBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /* 拍照 */
  takePhoto() {
    console.log("开始拍照");
    this.camera.takePhoto({
      quality: "high",
      success: (res) => {
        let imageSrc = res.tempImagePath;
        this.setData({ imageSrc });
        this.preview(imageSrc, "image");
        console.log("拍照结束", imageSrc);
      },
      fail: () => {
        console.log("拍照失败");
      },
    });
  },

  /* 开始录像 */
  startRecord() {
    console.log("开始录像");
    this.camera.startRecord();
  },

  /* 结束录像 */
  stopRecord() {
    this.camera.stopRecord({
      success: (res) => {
        let videoSrc = res.tempVideoPath;
        this.setData({ videoSrc });
        /* 预览 下一时刻 queueMicrotask*/
        this.preview(videoSrc, "video");
        console.log("结束录像", videoSrc);
      },
      fail() {
        wx.showModal({
          title: '检查权限',
          content: '请检查摄像头/麦克风权限',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              getSettingScopes(['camera', 'record'])
            }
          },
          fail: () => {}
        });
          
        console.log("========= 录像失败 ===========");
      },
    });

    /* 结束摄影拍摄完成 */
    this.setData({
      isPress: false,
      currentTime: 0,
    });
    clearInterval(this.timer)
  },

  //touch start 手指触摸开始
  handleTouchStart(e) {
    let startTime = e.timeStamp;
    this.setData({ startTime });
  },

  //touch end 手指触摸结束
  handleTouchEnd(e) {
    const { startTime } = this.data;
    let endTime = e.timeStamp;
    let dis = endTime - startTime;

    /* 判断是否为长按350，拍照不需要关闭   */
    if (dis > 350) {
      this.stopRecord();
    }
  },

  /**
   * 点击按钮 - 拍照
   */
  handleTap(e) {
    // console.log("拍照");
    this.takePhoto();
  },

  /**
   * 长按按钮 - 录像
   */
  handleLongPress(e) {
    // console.log("录像");
    this.setData({ isPress: true });
    this.startRecord();
    /* 最长时间10s，自动结束 */
    this.timer = setInterval(() => {
      const { currentTime, max_duration } = this.data;
      console.log(currentTime > max_duration, currentTime, max_duration);
      if (currentTime >= max_duration) {
        this.stopRecord();
        clearInterval(this.timer);
      }
      this.setData({
        currentTime: currentTime + 1,
      });
    }, 1000);
  },

  preview(url, type) {
    wx.previewMedia({
      sources: [{ url, type, showmenu: true }],
      success: () => {
        // 跳转发布页面
        wx.redirectTo({
          url: `/pages/publish/publish?url=${url}&type=${type}`,
        });
      },
    });
  },
});
