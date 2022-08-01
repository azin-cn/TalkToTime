import { checkUser } from "./user";

export function parseOptions(options = {}) {
  /* entry to object */
  if (Object.keys(options).length === 0) {
    return {}
  }
  return Object.fromEntries(Object.keys(options).map(option => {
    return [option, typeof options[option] === 'string' ? JSON.parse(options[option]) : options[option]]
  }))
}

const initNavOrReplaceArgs = {
  path: "/pages/index/index",
};
export function commonTo(type = "navigateTo", args=initNavOrReplaceArgs) {
  return new Promise((resolve, reject) => {

    const { path, data={} } = args;

    let url = path + "?" + Object.keys(data).reduce((prev, item) => {
      return prev + "&" + item + "=" + JSON.stringify(data[item]);
    }, "").slice(1);

    console.log(`${type} = `, url);

    if (type === "navigateTo") {
      wx.navigateTo({
        url: url,
        success: resolve,
        fail: reject,
        complete: () => {},
      });
      return;
    }

    wx.redirectTo({
      url: url,
      success: resolve,
      fail: reject,
      complete: () => {},
    });
  });
}

/**
 * NavigateTo跳转，Promise风格
 * args = {path:String, data:Object}
 * @param {Object} args 
 * @returns promise
 */
export function navigateTo(args) {
  return commonTo("navigateTo", args);
}

/**
 * RedirectTo跳转，Promise风格
 * args = {path:String, data:Object}
 * @param {Object} args 
 * @returns promise
 */
export function redirectTo(args) {

  return commonTo("redirectTo", args);
}

/**
 * Back回退，Promise风格
 * @param {Number} delta 
 * @returns promise
 */
export function back(delta) {

  return new Promise((resolve, reject) => {
    wx.navigateBack({
      delta: delta || 1,
      success: resolve,
      fail: reject,
    });
  })
}


/**
 * createNavigateToFuncWithPath() 实现柯里化
 * @param {*} path 
 * @returns 
 */
export function createNavigateToFuncWithPath(path) {

  return (args) => {
    navigateTo({
      ...args,
      path
    })
  }
}

export function redirectToIndex(args={}) {
  return redirectTo({
    ...args,
    path: '/pages/index/index'
  })
}


/**
 * navigateToLogin() 跳转login-page
 * @param {} args={data: {}}
 * @returns promise
 */
export function navigateToLogin(args={}) {
  return navigateTo({
    ...args,
    path: '/pages/login/login',
  })
}

/**
 * navigateToLoginWithCheckUser() 带有检查用户的navigateToLogin
 * @returns promise
 */
export async function navigateToLoginWithCheckUser() {
  return navigateToLogin({
    data: await checkUser()
  })
}

/**
 * navigateToCropper() 跳转图片裁剪 cropper-page
 * @param {Object} args = {data: {src, width, height, max_width, max_height, ....}, path}
 * @returns promise
 */
export function navigateToCropper(args={}) {
  return navigateTo({
    ...args,
    path: '/pages/cropper/cropper'
  })
}

/**
 * navigateToCropperWithEnableRatio() 固定比例的裁剪
 * @param {Object} args = {data: {src, width, height, max_width, max_height, ....}, path}
 * @returns promise
 */
export function navigateToCropperWithEnableRatio(args = {}) {
  return navigateToCropper({
    data: {
      ...args.data, /* 注意参数的设置和传递 */
      disable_ratio: 1
    }
  })
}

export function navigateToProfile(args={}) {
  return navigateTo({
    ...args,
    path: '/pages/profile/profile'
  })
}

/**
 * navigateToSearch()
 * @param {*} args 
 * @returns 
 */
export function navigateToSearch(args={}) {
  return navigateTo({
    ...args,
    path: '/pages/search/search'
  })
}

/**
 * navigateToPublish()
 * @param {*} args 
 * @returns 
 */
export function navigateToPublish(args={}) {
  return navigateTo({
    ...args,
    path: '/pages/publish/publish'
  })
}


/**
 * redirectToLogin() 
 * @param {*} args 
 * @returns 
 */
export function redirectToLogin(args={}) {
  return redirectTo({
    ...args,
    path: '/pages/login/login'
  })
}

export const router = {
  commonTo,
  navigateTo,
  redirectTo,
  back,


  redirectToIndex,
  
  navigateToLogin,
  navigateToLoginWithCheckUser,
  redirectToLogin,

  navigateToCropper,
  navigateToCropperWithEnableRatio,

  navigateToProfile,

  navigateToSearch,

  navigateToPublish,
}

export default router