// components/MainCard/MainCard.js
import debounce from "../../../utils/debounce";

Component({
  externalClasses: ["ext-class"],
  properties: {
    scroll_top: 0,
  },
  data: {
    loading: false,
    cards_group: [[]],
  },

  lifetimes: {
    attached: function () {
      this.init();
    },
  },

  methods: {
    init() {
      this.setData({
        loading: false,
        cards_group: [[]],
      });
      this.handleGetData();
    },

    /* 回顶相关 */
    onScroll: debounce(function (e) {
      const { scrollTop: top } = e?.detail;
      const show_to_top = top >= 300 ? true : false;
      this.triggerEvent("showToTop", { show_to_top });
    }, 300),

    /* 下拉刷新 */
    onRefresh() {
      console.log("note - refresh");
      this.setData({ loading: true });
      /* 网路请求部分 */
      let timer = setTimeout(() => {
        this.setData({ loading: false });
        clearTimeout(timer);
        this.init();
      }, 1000);
    },

    /* 上拉加载更多 */
    onPullUp: debounce(function () {
      this.setData({ loading: true });

      console.log("onPullUp");
      let { cards_group, cards_c } = this.data;
      cards_c = cards_c.map((card) => {
        card.id = Date.now() + Math.random();
        return card;
      });
      this.setData({
        loading: false,
        ["cards_group[" + cards_group.length + "]"]: cards_c,
      });
      console.log(this.data.cards_group.length * cards_c.length);
      console.log(this.data.cards_group);
    }, 600),

    handleGetData() {
      // wx.cloud.callFunction({
      //   name:'card',
      //   data:{
      //     type:'getCards',
      //     currenPage:1,
      //     pageSize:10,
      //     location:{
      //       x:10,
      //       y:52
      //     },
      //     city:'佛山市'
      //   }
      // }).then(res =>{
      //   console.log(res)

      // })

      /* 网络请求 */
      let cards = [
        {
          article_id: Date.now(),
          avatar_url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019fb65925bc32a801216a3ef77f7b.png%401280w_1l_2o_100sh.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655873803&t=85b8cb4ca13d584ca51278c9a0836ec9",
          openid: 0,
          username: "人间四月是清明",
          tag: "官方精选讲师官方精选讲师",
          official: true,
          published_date: new Date().toLocaleDateString(),
          is_attend: true,
          title: "美丽中国,美丽中国,美丽中国",
          content:
            "美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。",
          url: "https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF",
          handles: [true, false, false, false],
          comments: 3,
          favs: 10,
          top_comments: [
            "Adoifv：是真的好看",
            "人间四月是清明：求机位点求几位点计算机计算机 就死机经济上的",
          ],
        },
        {
          article_id: Date.now() + Math.random(),
          openid: 0,
          avatar_url:
            "https://img2.baidu.com/it/u=976187030,237040006&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
          username: "小F",
          tag: "Lv1",
          official: false,
          published_date: new Date().toLocaleDateString(),
          is_attend: true,
          title: "美丽中国",
          content:
            "我想文字的意义，就在于能帮到我们把内心的情感表达出来，从而让它看得到摸得着。. 文字是我们内心思想、情感和信息的转码。. 我曾非常痴情于歌唱，想用歌声表达自己胸中涌动的情感，可惜我没能遇上这机会。",
          url: "https://t7.baidu.com/it/u=3631608752,3069876728&fm=193&f=GIF",
          handles: [false, false, false, false],
          comments: 3,
          favs: 10,
          top_comments: ["Adoifv：是真的好看", "人间四月：求机位点"],
        },
        {
          article_id: Date.now() + Math.random(),
          openid: 0,
          avatar_url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0314%252F94ad46dbj00qpy1do0021d200rs00rsg008t008t.jpg%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655875053&t=2764f5347e6efd28adf000b7db41ab65",
          username: "小G",
          tag: "Lv1",
          official: false,
          published_date: new Date().toLocaleDateString(),
          title: "美丽中国",
          content:
            "美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。美丽乡村，美丽中国。",
          url: "https://t7.baidu.com/it/u=1415984692,3889465312&fm=193&f=GIF",
          handles: [true, false, false, false],
          comments: 3,
          favs: 10,
          top_comments: ["Adoifv：是真的好看", "人间四月是清明：求机位点"],
        },
        {
          article_id: Date.now() + Math.random(),
          openid: 0,
          avatar_url:
            "https://img2.baidu.com/it/u=1720444668,1660517678&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
          username: "小H",
          tag: "Lv1",
          official: true,
          published_date: new Date().toLocaleDateString(),
          title: "美丽中国",
          content:
            "汉字是历史上最古老的文字之一。也是至今通行的世界上最古老的文字。世界上还没有任何一种文字像汉字这样经久不衰。 从甲骨文发展到今天的汉字，已经有数千年的历史。文字的发展经过了甲骨文",
          url: "https://t7.baidu.com/it/u=1819248061,230866778&fm=193&f=GIF",
          handles: [false, false, false, false],
          comments: 3,
          favs: 10,
          top_comments: ["Adoifv：是真的好看", "人间四月是清明：求机位点"],
        },
      ];

      this.setData({
        ["cards_group[" + 0 + "]"]: cards,
        cards_c: cards,
      });

      console.log(this.data.cards_group);
    },
  },
});
