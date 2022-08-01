export default function getSettingScope(scope) {

  let content = scope
  switch (scope) {
    case 'camera':
      content = '摄像头' 
      break;
    case 'record':
      content = '麦克风'
      break;
  }
  scope = `scope.${scope}`
  content = `请前往设置页授予${content}权限`

  const options = {
    scope: scope,
    content: content,
  };
  
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        let auth = res.authSetting[options.scope];
        console.warn(`${options.scope}=`, auth);

        switch (auth) {
          case true /* 若已授权 */:
            resolve(true);
            break;

          case false /* 未授权 */:
            wx.showModal({
              title: "授权提示",
              content: options.content,
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting[options.scope]) {
                        resolve(true);
                      }
                      console.warn("settingRes", settingRes);
                    },
                  });
                }
              },
            });
            break;

          default: /* undefined */
            wx.authorize({
              scope: options.scope,
              success() {
                resolve(true);
              },
              fail(err) {
                reject(false)
              },
            });
        }
      },
    });
  });
}


export async function getSettingScopes(scopes) {
  return Promise.all(
    scopes.map(scope => {
      return getSettingScope(scope)
    })
  )
}