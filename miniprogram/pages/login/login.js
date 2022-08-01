import { userRegister } from "../../api/user";
import upload from "../../utils/cloud/upload";
import router from "../../utils/wechat/router";
import {
  hiddenLoading,
  showErrorModal,
  showErrorToast,
  showLoading,
  showSuccessToast,
} from "../../utils/wechat/toast";

const global_data = getApp().globalData;
const defaultAvatarUrl = global_data?.defaultAvatarUrl;

Page({
  data: {
    avatar_url: defaultAvatarUrl,
    nickname: "",
    gender: 1,
    registered: false,
  },
  onLoad(options) {
    let {
      avatar_url = defaultAvatarUrl,
      nickname,
      gender,
      registered,
    } = options;

    registered *= 1;
    console.log("registered = ", registered === 1);
    /* 登录 */
    if (registered) {
      this.setData({
        avatar_url,
        nickname,
        gender,
        registered,
      });
      return;
    }

    /* 注册 */
  },

  onShow() {
    const { crop_img } = global_data;
    if (crop_img) {
      this.setData({
        avatar_url: crop_img.url,
        crop_img: crop_img,
      });
      console.log("login crop_img = ", crop_img);
    }
  },
  
  /* toast提示窗 */
  onTapAvatar() {
    showLoading();
  },

  /* 获取用户头像临时文件地址 */
  onChooseAvatar(e) {
    hiddenLoading();
    showSuccessToast({ title: "注册成功！" });
    const { avatarUrl: avatar_url } = e.detail;
    this.setData({ avatar_url });

    /* 跳转裁剪 */
    router.navigateToCropperWithEnableRatio({
      data: {
        src: avatar_url,
      },
    });
  },

  /* 获取gender */
  handleChangeGender(e) {
    this.setData({
      gender: e.detail.value * 1,
    });
  },

  /* 提交 */
  handleSubmit(e) {
    const { avatar_url, gender } = this.data;
    const { nickname } = e.detail.value;
    if (!nickname) {
      showErrorToast({
        title: "昵称不为空！",
      });
      return ;
    }
  },

  register(){

    const { avatar_url, gender } = this.data;

    showLoading({ title: "注册中~" });

    /**
     * 数据传值问题，不能直接拿到crop_img
     * 通过App实现不同页面的传值，无论是传递函数还是传递值最好通过App实现
     * 通过不同页面的触发onShow进行判断！
     */

    /* 上传头像 */
    upload({ prefix: "user", filePath: avatar_url })
      .then((res) => {
        const { fileID } = res;
        return userRegister({
          avatarUrl: fileID,
          nickName: nickname,
          gender: gender,
        });
      })
      .then(
        (res) => {

          console.log(res);
          const { _id: id } = res;
          // wx.setStorageSync("id", id);
          // wx.setStorageSync("avatar_url", avatar_url);
          // wx.setStorageSync("nickname", nickname);
          // wx.setStorageSync("gender", gender);
          showSuccessToast({ title: "注册成功！" });

          router.back();
        },
        (err) => {
          hiddenLoading()
          showErrorModal({ title: "注册失败！", content: "网络不稳定！" });
        }
      ).finally(() => {})
  },
});
