import { getExtension } from "../file/format";
import uuid from "../math/uuid";

/**
 * upload 默认为Promise风格
 * args: {filePath: require, cloudPath}
 * @param {Object} args 
 * @returns 
 */
export default function upload(args={}) {
  return new Promise((resolve, reject) => {

    if (typeof args === 'string') {
      args = {filePath: args}
    }
    
    let {id, prefix='card', cloudPath, filePath} = args
    if(!filePath) {
      reject('文件路径错误！'); return ;
    }

    if (!cloudPath) {
      cloudPath = `${prefix}/${id || uuid()}${getExtension(filePath)}` 
    }

    wx.cloud.uploadFile({
      cloudPath: cloudPath, // 云路径
      filePath: filePath, // 临时文件路径
      success: resolve,
      fail: reject
    })
  })
}