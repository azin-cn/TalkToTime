export function getFileName(file) {
  return file.substring(0, file.lastIndexOf('.'))
}
export function getExtension(file) {
  return file.substring(file.lastIndexOf('.'))
}
export function getExtName(file) {
  return file.substring(file.lastIndexOf('.')+1)
}
export function isPicture(file) {
  return ['png', 'jpg','jpeg', 'jfif', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      .includes(getExtName(file.toLowerCase()))
}