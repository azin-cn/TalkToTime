/* 暂不使用柯里化 */

const defaultAvatarUrl = 
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

export function cloudCall(params={}) {
  
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      // 云函数（模块）名称
      name: "user",
      data: {
        type: "getUserInfo",
      },

      success: (res) => resolve(res.result),
      fail: reject,

      ...params
    })
  });
}

/**
 * getUserInfo() 获取用户信息
 * @returns 
 */
export function getUserInfo() {
  return cloudCall({
    name: 'user',
    data: {
      type: 'getUserInfo'
    }
  })
}

/**
 * userRefister() 注册用户
 * @param {*} data 
 * @returns 
 */
export function userRegister(data={}) {
  return cloudCall({
    name: 'user',
    data: {
      type: 'userRegister',
      avaterUrl: defaultAvatarUrl,
      nickName: 'Hello',
      gender: 1,
      ...data
    }
  })
}