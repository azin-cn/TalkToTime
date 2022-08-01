function handleArgs(args) {
  if (typeof args === "string") {
    args = { filePath: args };
  }
  return args;
}

export function getFileSystemManager() {
  return wx.getFileSystemManager();
}

/**
 * readFile() 读取文件
 * @param {*} args {filePath:require, encoding: 编码格式}
 * @returns promise
 */
export function readFile(args, type = "async") {
  return new Promise((resolve, reject) => {
    if (!args) {
      reject("文件路径错误！");
      return;
    }

    args = handleArgs(args);

    let manager = getFileSystemManager();

    let data = {
      filePath: "",
      encoding: "",
      success: resolve,
      fail: reject,
      complete: () => {},

      ...args,
    };

    if (type === "async") {
      manager.readFile({
        ...data,
      });
    } else {
      manager.readFileSync({
        ...data,
      });
    }
  });
}

/**
 * readFileSync() 读取文件
 * @param {*} args {filePath:require, encoding: 编码格式}
 * @returns promise
 */
export function readFileSync(args) {
  args = handleArgs(args);
  return readFile(args, "sync");
}

/**
 * readFileWithBase64  以base64方式读取文件返回内容
 * @param {*} args {filePath:require}
 * @returns promise
 */
export function readFileWithBase64(args) {
  args = handleArgs(args);
  return readFile({
    ...args,
    encoding: "base64",
  });
}

/**
 * readFileSyncWithBase64  以base64方式同步读取文件返回内容
 * @param {*} args {filePath:require}
 * @returns promise
 */
export function readFileSyncWithBase64(args) {
  args = handleArgs(args);
  return readFileSync({
    ...args,
    encoding: "base64",
  });
}

/**
 * access() 异步判断文件
 * @param {*} args 
 * @param {*} type 
 * @returns 
 */
export function access(args) {
  return new Promise((resolve, reject) => {
    args = handleArgs(args);
    const fs = getFileSystemManager();

    let data = {
      path: "",
      success: resolve,
      fail: reject,
  
      ...args,
    }

    fs.access({
      ...data
    });
  });
}

/**
 * accessSync() 同步判断文件
 * @param {*} path 
 * @returns 
 */
export function accessSync(path) {
  const fs = getFileSystemManager();

  if (typeof path !== 'string') {
    throw TypeError('参数类型错误！')
  }

  try {
    let res = fs.accessSync(path)
    return true
  } catch (e) {
    return false
  }
}