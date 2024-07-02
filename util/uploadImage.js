import { storage } from './firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const uploadAndGetImgUrls = async images => {
  return await Promise.all(
    images.map(async img => {
      // if the image is already uploaded then return the same
      if (img.url) return img
      // upload img to firebase
      const imgRef = ref(storage, `images/${img.id}`)
      await uploadBytes(imgRef, img.file)
      // get the img url and return
      const url = await getDownloadURL(imgRef)
      return { id: img.id, url: url }
    })
  )
}
