import { getSettingScopes } from "../../../utils/getSettingScope";
import { getCityFromLocation } from "../../../utils/wechat/location";
import {
  chooseMediaFromCamera,
  chooseImageFromAlbum,
} from "../../../utils/wechat/media/choose";
import router from "../../../utils/wechat/router";
const global_data = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles: {
      type: Array,
      value: ["笔记", "社区", "Let's go"],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    /* 后台动态决定是否为热点 如hotArray: [1, 2] */
    hotArray: [2],

    city: "",
  },

  lifetimes: {
    attached() {
      getCityFromLocation()
        .then((res) => {
          const { address_component } = res.data.result;
          const { city } = address_component;
          global_data.address_component = address_component;
          global_data.city = city;
          this.setData({ city });

          console.log(city);
        })
        .catch((err) => console.log(err));
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapTitle(e) {
      let currentIndex = e.currentTarget.dataset?.index;
      console.log(
        "currentIndex：",
        currentIndex,
        "热点：",
        this.data.hotArray.indexOf(currentIndex) !== -1
      );

      if (currentIndex != 2) {
        this.setData({ currentIndex });
        return;
      }

      // 跳转摄像头 | 寻找拍摄地点
      wx.showActionSheet({
        itemList: ["拍摄", "相册"],
        fail() {},
        success(res) {
          let index = res.tapIndex;

          /* 拍摄 获取权限 */
          if (index === 0) {
            getSettingScopes(["camera", "record"])
              .then((res) => {
                /* 废弃camera */
                // router.navigateTo({
                //   path: "/pages/camera/camera"
                // })

                /* 只允许拍摄图片或视频 */
                return chooseMediaFromCamera({ count: 1 });
              })
              .then((res) => {
                router.navigateToPublish({
                  data: {
                    tempFiles: res.tempFiles,
                    type: res.type,
                  },
                });
              });

            return;
          }

          /* 只允许从相册选择图片 */
          chooseImageFromAlbum({
            count: 6,
          }).then((res) => {
            router.navigateToPublish({
              data: {
                tempFiles: res.tempFiles,
                type: res.type,
              },
            });
          });
        },
      });
    },
    onPickerChange(e) {
      /* 省-市-区 小程序bug，不能选择level */
      const { value: location } = e.detail;
      console.log(location);

      let city = location[1];
      this.setData({ city });
      global_data.city = city;
    },
    onPickerCancel(e) {},
  },
});
