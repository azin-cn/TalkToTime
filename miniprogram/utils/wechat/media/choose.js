export function chooseMedia(args={}) {
  return wx.chooseMedia({
    count: 9,
    mediaType: ["mix"],
    sourceType: ['album', 'camera'],
    sizeType: ["compressed"],

    ...args
  });
}

export function chooseMediaFromAlbum(args={}) {
  return chooseMedia({
    ...args,
    sourceType: ['album']
  })
}

export function chooseMediaFromCamera(args={}) {
  return chooseMedia({
    ...args,
    sourceType: ['camera']
  })
}

export function chooseImage(args={}) {
  return chooseMedia({
    ...args,
    mediaType: ['image']
  })
}

export function chooseImageFromAlbum(args={}) {
  return chooseImage({
    ...args,
    sourceType: ['album'],
  })
}

export function chooseImageFromCamera(args={}) { 
  return chooseImage({
    ...args,
    sourceType: ['camera'],
  })
}


export function chooseVideo(args={}) {
  return chooseMedia({
    ...args,
    mediaType: ['video'],
  })
}


export function chooseVideoFromAlbum(args={}) {
  return chooseVideo({
    ...args,
    sourceType: ['album']
  })
}

export function chooseVideoFromCamera(args={}) {
  return chooseVideo({
    ...args,
    sourceType: ['camera']
  })
}