import debounce from "../../../utils/debounce";
import router from "../../../utils/wechat/router";
import { showErrorToast } from "../../../utils/wechat/toast";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    props: {
      type: Object,
      value: {},
    },

    /* Header */
    // openid
    // avatar_url:String,
    // username: String,
    // tag: String,
    // official: Boolean,
    // published_date: String,

    /* Main */
    // article_id: Number
    // title: String,
    // content: String,
    // url: String,

    /* Footer */
    // handles: Array,
    // comments: Number,
    // favs: Number,
    // top_comments: Array
  },

  data: {
    footer_icons: [
      "icon-xihuan",
      "icon-shoucang",
      "icon-pinglun",
      "icon-map-pin-range-fill",
    ],
    footer_handle_icons: [],
    footer_brief_info_tip: "等喜欢",
    footer_brief_info: `共0条评论，0收藏`,
    footer_input_val: "",
    footer_bottom: 0,
  },

  lifetimes: {
    attached() {
      const { props } = this.properties;
      this.setData({
        ...props,
      });
      const { handles } = this.properties;
      const { footer_icons, footer_handle_icons } = this.data;
      handles.forEach((handle, index) => {
        footer_handle_icons.push(handle);
        footer_icons[index] = handle
          ? footer_icons[index].replace("-", "-yi")
          : footer_icons[index];
      });
      this.setData({
        footer_icons,
        footer_handle_icons,
      });
      this.setData({
        footer_brief_info: `共${this.data.comments}条评论，${this.data.favs}收藏`,
      });
    },
  },

  methods: {
    /* Header区域 */
    handleAttend: debounce(function (e) {
      console.log("handleAttend");
      /* 网络请求 关注 */
      this.setData({
        is_attend: !this.data.is_attend,
      });

      console.log('用户ID：', this.data.openid)
    }),
    handleGetUserInfo(e) {
      /* 跳转用户详细页面 */
      console.log("handleGetUserInfo");
      router.navigateTo({
        path: "/pages/profile/profile",
        data: {
          openid: this.properties.openid,
        },
      });
    },

    /* Main区域 */
    handleGetDetail() {
      console.log("handleGetDetail");
      this.toArticle("info");
    },
    handlePreviewImg() {
      
    },
    handleLoadedImg() {
      
    },
    handleLoadError() {
      showErrorToast();
    },

    /* Footer区域 */
    handleTapIcon(e) {
      /* 处理Icon点击 喜欢|收藏|评论|位置 */
      const { icon } = e?.target?.dataset;
      if (!icon) return;

      /* 网络请求接口，点赞，收藏，暂时不做防抖*/
      const { footer_icons, footer_handle_icons } = this.data;
      const idx = footer_icons.indexOf(icon);
      const flag = !footer_handle_icons[idx];

      if (idx + 1 === 3) {
        this.toArticle("comment");
        return;
      }
      if (idx + 1 === 4) {
        /* 跳转地图 */
        return ;
      }

      footer_icons[idx] = flag
        ? icon.replace("-", "-yi")
        : icon.replace("-yi", "-");
      footer_handle_icons[idx] = flag;

      this.setData({ footer_icons, footer_handle_icons });
      this.triggerEvent("handleTapIcon", flag);

      console.log(footer_icons[idx], footer_handle_icons[idx]);
    },

    handleTapMoreComment() {
      console.log("handleTapMoreComment");
      this.toArticle("comment");
    },

    toArticle(type = "comment") {
      console.log(router);
      router.navigateTo({
        path: "/pages/article/article",
        data: {
          article_id: this.properties.article_id,
          type,
        },
      });
    },

    /* 废弃部分 */

    handleCommitComment(e) {
      /* 评论提交请求 */
      const { value } = e.detail;
      console.log(value);

      /* 清除输入框的内容 */
      this.setData({
        footer_input_val: "",
      });
    },
    inputFocus(e) {
      console.log("键盘弹出！");

      this.setData({
        footer_bottom: e.detail.height + 10,
      });
      console.log(this.data.footer_bottom);
    },
    inputBlur(e) {
      console.log("键盘收起！");
      this.setData({
        footer_bottom: 0,
      });
    },
  },
});
