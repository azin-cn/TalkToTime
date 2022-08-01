const chooseLocation = requirePlugin("chooseLocation"); //导入插件

import upload from "../../utils/cloud/upload";
import debounce from "../../utils/debounce";
import { isPicture } from "../../utils/file/format";
import { getSettingScopes } from "../../utils/getSettingScope";
import { getMapKey } from "../../utils/wechat/location";
import {
  chooseMediaFromCamera,
  chooseImage,
  chooseImageFromAlbum,
} from "../../utils/wechat/media/choose";
import preview from "../../utils/wechat/media/preview";
import router, { parseOptions } from "../../utils/wechat/router";
import {
  hiddenLoading,
  showErrorModal,
  showErrorToast,
  showLoading,
  showSuccessToast,
} from "../../utils/wechat/toast";

const global_data = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "image",
    image_list: [],
    max_image_list_length: 6,
    video_src: "",

    title: "",
    content: "",
    title_placeholder: "添加分享标题",
    content_placeholder: "此刻想说些...",
    max_title_length: 64,
    max_content_length: 512,
    content_length: 0,

    loading: false,

    location: global_data.city,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options = ", (
      options = options?.tempFiles 
      ? parseOptions(options)
      : options
    ));
    // options = parseOptions(options)
    /* options传入的数据只会有一个image或者video */
    if (!options?.tempFiles) {
      return;
    }
    this.updateMedia(options);
    // this.setData({
    //   image_list: [
    //     "https://t7.baidu.com/it/u=1819248061,230866778&fm=193&f=GIF",
    //     "https://t7.baidu.com/it/u=1819248061,230866778&fm=193&f=GIF",
    //   ],
    // });
  },

  onShow: function () {
    // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (!location) {
      return;
    }
    this.setData({
      location: location.city + " " + location.address,
    });
  },

  handleSetTitle(e) {
    this.setData({ title: e.detail.value.trim() });
  },
  handleSetContent() {},
  handleInputContent(e) {
    // this.setData({content_length: e.detail.cursor}) /* 不准确 */
    this.setData({
      content: e.detail.value.trim(),
      content_length: e.detail.value.trim().length,
    });
  },
  handleLoadImage() {
    console.log("图片加载完成");
  },
  handleWaitingVideo() {
    console.log("等待加载~");
  },
  handleTapMedia(e) {
    console.log(e.target.dataset);
    /* 判断是否为点击了媒体，如果没有type，则说明点击了del-icon */
    const { type, index } = e.target.dataset;

    if (!type && !(index + 1)) {
      /* 防止点击空白区域，注意index是从0开始的 */
      return;
    }

    if (type) {
      /* 预览媒体文件 */
      console.log("预览媒体文件（列表）");
      let sources = this.data.image_list
      let current = index

      switch (type) {
        case 'image':
          preview(sources, current)
          break;
        case 'video':
          return ; /* 取消预览视频 */
          sources = [this.data.video_src]
          preview(sources, current)
          break;
      }


      return;
    }

    /* ============删除============= */

    /* 图片类型 */
    if (this.data.type === "image") {
      let { image_list } = this.data;
      this.setData({
        image_list: image_list.filter((image, idx) => {
          return index !== idx;
        }),
      });
      return;
    }

    /* 视频类型 */
    this.setData({
      video_src: "",
      type: "image" /* 注意设置type否则无法添加 */,
    });
  },
  handleAppendMedia() {
    console.log("添加媒体文件");
    /* 相册只能选择照片，视频可以进行拍摄 */
    /* 判断image_list是否为空，如果为空则允许拍摄视频，如果不为空则只允许选择图片 */

    /* 如果不为空 动态计算还可以选择多少张图片 */
    if (this.data.image_list.length) {
      chooseImage({
        count: this.data.max_image_list_length - this.data.image_list.length,
      })
        .then((res) => {
          console.log(res);

          /* 更新图片列表 */
          this.updateMedia(res);
        })
        .catch((err) => {
          // showErrorModal({title: '加载失败！'})
        });
      return;
    }

    /* 如果image_list为0，那么可以选择视频或者图片，注意单独控制 */
    wx.showActionSheet({
      itemList: ["拍摄", "相册"],
    })
      .then((res) => {
        let index = res.tapIndex;

        /* 拍摄 获取权限 */
        if (index === 0) {
          getSettingScopes(["camera", "record"]).then((res) => {
            /* 只允许拍摄图片或视频 */
            chooseMediaFromCamera({ count: 1 }).then((res) => {
              this.updateMedia(res);
              console.log(res);
            });
          });
          return;
        }

        /* 只允许从相册选择图片 */
        chooseImageFromAlbum({ count: this.data.max_image_list_length }).then(
          (res) => {
            /* 更新图片列表 */
            this.updateMedia(res);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },
  updateMedia(res) {
    let path = res.tempFiles[0].tempFilePath;
    let is_picture = isPicture(path);

    let { tempFiles: images } = res;
    images = is_picture
      ? images.map((image) => {
          return image.tempFilePath;
        })
      : [];

    const { max_image_list_length, image_list } = this.data;
    images =
      images.length + image_list.length > max_image_list_length
        ? images.slice(max_image_list_length - image_list.length)
        : images;

    this.setData({
      type: is_picture ? "image" : "video",
      image_list: is_picture ? [...this.data.image_list, ...images] : [],
      video_src: is_picture ? "" : path,
    });
  },

  publish() {
    const { type, image_list, video_src, title, content, location } = this.data;

    this.isNotEmpty()
      .then(() => {
        /* 检查非空，准备数据 */

        switch (type) {
          case "image":
            return image_list;
          case "video":
            return [video_src];
        }
      })
      .then((sources) => {
        /* 上传媒体文件 */
        showLoading();
        console.log('------上传媒体文件-------')
        return this.uploadMedia(sources);
      })
      .then((res) => {
        /* 提取fileID */
        hiddenLoading();
        console.log("---------提取fileID--------");
        return res.map((item) => {
          return item.fileID;
        });
      })
      .then((ids) => {
        /* 上传标题、内容、fileids */
        console.log(ids);
        console.log('----------上传标题、内容、fileids----------')

        /* 待做 */
      })
      .then(res => {
        showSuccessToast({title: '发布成功啦！'})
        router.redirectToIndex({
          data: {
            flash_with_publish: true
          }
        })
      })
      .catch((err) => {
        hiddenLoading();
        showErrorModal({ title: "发布失败啦！", content: "请检查网络！" });
      });
  },

  isNotEmpty() {
    return new Promise((resolve, reject) => {
      const { title, content, image_list, video_src } = this.data;
      if (!title) {
        let err = "标题不能为空"
        showErrorToast({ title: err });
        reject(err);
      }
      if (!content || (!image_list.length && !video_src)) {
        let err = 内容不能为空
        showErrorToast({ title: err });
        reject(err);
      }
      resolve("ok");
    });
  },

  uploadMedia(sources) {
    sources = sources.map(source => {
      return upload(source)
    })
    return Promise.all(sources)
  },

  handleChooseLocation: debounce(function () {
    const KEY = getMapKey(); //使用在腾讯位置服务申请的key
    const referer = "Time"; //调用插件的app的名称
    router.navigateTo({
      path: "plugin://chooseLocation/index?key=" + KEY + "&referer=" + referer,
    });
  }, 1000),
});
