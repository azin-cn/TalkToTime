export default function showToast(args) {
  wx.showToast({
    title: 'Hello',
    duration: 1500,
    ...args
  });
}

export function showLoadingToast(args) {
  showToast({title: 'loading', ...args, icon: 'loading'})
}

export function showSuccessToast(args) {
  showToast({title: 'You are right', ...args, icon: 'success'})
}

export function showErrorToast(args) {
  showToast({title: '网路不稳定', ...args, icon: 'error'})
}

export function showInfoToast(args) {
  showToast({title: 'Hello~', ...args, icon: 'none'})
}

/**
 * showLoading() 自定义控制关闭的loading
 * @param {*} args 
 */
export function showLoading(args) {
  wx.showLoading({
    title: 'loading',
    mask: false,
    success: (result)=>{},
    fail: ()=>{},
    complete: ()=>{},
    
    ...args
  });
}

export function hiddenLoading() {
  wx.hideLoading();
}

export function showErrorModal(args) {
  return wx.showModal({
    title: 'Error',
    content: '错误！',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F',
    success: (result) => {
      if (result.confirm) {
        
      }
    },
    fail: () => {},
    complete: () => {},

    ...args
  });
    
}