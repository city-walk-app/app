/**
 * 上传照片到 OSs
 */
export const uploadOSSImages = async (API, fileList) => {
  if (!fileList || !fileList.length) {
    return []
  }

  return await Promise.all(
    fileList.map(async (item) => {
      const res = await API.universalContentUpload({
        suffix: '.jpg',
      })

      if (res.code !== 200) {
        toast(res.message)
        return ''
      }

      const { host, key, policy, OSSAccessKeyId, signature } = res.data
      const url = `${host}/${key}`

      const upRes = await uni.uploadFile({
        url: host,
        filePath: item,
        name: 'file',
        formData: {
          key,
          policy,
          OSSAccessKeyId,
          signature,
        },
      })

      console.log('上传结果', upRes)

      if (upRes.errMsg !== 'uploadFile:ok') {
        toast('图片上传异常')
        return
      }

      return url
    })
  )
}