//  地里信息位置获取工具类

import request from "../../api/request";
import router from "./router";

const KEY = 'Q7QBZ-R5VED-3YE4D-HORZP-XHTXJ-4UBXX'

const MAPURL = 'https://apis.map.qq.com/ws/geocoder/v1/?location='

export function getMapKey() {
  return KEY
}

/**
 * getLocation() 获取经纬度信息
 * @returns promise
 */
export function getLocation() {
  return new Promise((resolve, reject) => {
    let _locationChangeFn = (res) => {
      resolve(res); // 回传地里位置信息
      wx.offLocationChange(_locationChangeFn); // 关闭实时定位
      wx.stopLocationUpdate(_locationChangeFn); // 关闭监听 不关闭监听的话，有时获取位置时会非常慢
    };
    wx.startLocationUpdate({
      success: (res) => {
        wx.onLocationChange(_locationChangeFn);
      },
      fail: (err) => {
        // 重新获取位置权限
        wx.openSetting({
          success(res) {
            res.authSetting = {
              "scope.userLocation": true,
            };
          },
        });
        reject(err);
      },
    });
  });
};

export function getCityFromLocation() {
  
  return getLocation().then(location => {

    location = `${location.latitude},${location.longitude}`
    return request({
      url: `${MAPURL}${location}&key=${KEY}`
    })
  })
}

/**
 * chooseLocation() 腾讯位置选点
 * const chooseLocation = requirePlugin("chooseLocation");
 * 需要导入插件chooseLocation，在页面的onShow生命周期中进行调用location.getLocation()即可拿到位置
 */
export function chooseLocation() {
  const KEY = getMapKey(); //使用在腾讯位置服务申请的key
  const referer = "Time"; //调用插件的app的名称
  router.navigateTo({
    path: "plugin://chooseLocation/index?key=" + KEY + "&referer=" + referer,
  });
}