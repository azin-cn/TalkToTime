export default function request(args={}) {

  return new Promise((resolve, reject) => {

    if(!args || !(args?.url)) {
      reject('Error: URL不能为空！')
      return ;
    }

    wx.request({
      url: '',
      data: {},
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',

      success: resolve,
      fail: reject,
      complete: () => {},

      ...args,
    });
  })
}