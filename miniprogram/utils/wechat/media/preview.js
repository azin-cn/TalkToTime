import { isPicture } from "../../file/format";

/**
 * preview Promise风格，参数遵循微信wx.previewMedia，
 * 单个传入url 或 组合多个url的数组&当前索引current
 * @param {*} sources sources=[ url1, url2, url3, [...]], [current]
 * @returns
 */
export default function preview(sources = [], current = 0) {
  return new Promise((resolve, reject) => {
    /* 单个预览 */
    if (typeof sources === "string") {
      sources = [{ url: sources, type: isPicture(sources) ? "image" : "video" }];
    }

    /* 可以此判断放在单个预览之前 */
    if (sources instanceof Array) {
      sources = sources.map((source) => {
        return { url: source, type: isPicture(source) ? "image" : "video" };
      });
    }

    wx.previewMedia({
      success: resolve,
      fail: reject,
      sources,
      current
    });
  });
}
