import { getUserInfo } from "../../api/user";
import { accessSync } from "../file/io";

/**
 * checkID() 检查本地用户数据，storage存储id
 * @returns boolean
 */
export function checkID() {
  let res = !!wx.getStorageSync("id");
  console.log("本地是否有ID：", res);
  return res;
}

export function getID() {
  return wx.getStorageSync("id");
}

/**
 * checkUser() 检查用户，本地缓存》数据库是否注册
 * @returns {} {type: '显示页面', registered: '是否已注册', [user: {info}]}
 */
export async function checkUser() {
  /* 检查本地缓存信息：登录页面 */
  let id, nickname, avatar_url, gender;
  if (
    (id = wx.getStorageSync("id")) &&
    (nickname = wx.getStorageSync("nickname")) &&
    accessSync((avatar_url = wx.getStorageSync("avatar_url"))) &&
    (gender = wx.getStorageSync("gender"))
  )
    return {
      type: "login",
      registered: 1,
      user: { id, nickname, avatar_url, gender },
    };

  /* 在线获取用户信息：检测用户是否已经注册 */

  /* 查询用户 */
  let res = await getUserInfo()

  /* 用户未注册 */
  if (res?.errCode === "202") {
    /* 注册页面 */
    return { type: "register", registered: 0 };
  }

  /* 用户已注册，返回用户数据 */
  return {
    type: "login",
    user: res,
    registered: 1,
  };
}