import { Schema, models, model } from 'mongoose'
import { deleteObject, ref } from 'firebase/storage'
import { db, storage } from '../util/firebase'
import Review from './Review'
import User from './User'

const campgroundSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
      max: 750,
    },
    price: {
      type: { adults: Number, children: Number, discount: Number },
      required: true,
    },
    images: {
      type: [{ url: String, id: String }],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: 'Review',
    },
    location: {
      type: {
        coords: { lat: Number, long: Number },
        city: String,
        state: String,
        country: String,
      },
      required: true,
    },
    rating: {
      type: Number,
    },
    amenities: {
      type: [{ icon: String, text: String }],
      required: true,
    },
    plusExclusive: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: true,
    },
  },
  { timestamps: true }
)

campgroundSchema.statics.findAndAddReview = async function (review) {
  const campground = await this.findById(review.campground)

  campground.rating = (
    ((campground.rating || 0) * campground.reviews.length + review.rating) /
    (campground.reviews.length + 1)
  ).toFixed(1)

  campground.reviews.push(review._id)

  await campground.save()
}

campgroundSchema.post('findOneAndDelete', async doc => {
  doc.images.forEach(async image => {
    await deleteObject(ref(storage, `images/${image.id}`))
  })
  // delete all reviews of this campground
  await Review.deleteMany({ _id: { $in: doc.reviews } })

  // remove campground id from users account
  await User.findByIdAndUpdate(doc.owner, { $pull: { campgrounds: doc._id } })
})

campgroundSchema.post('findOneAndUpdate', async function (doc) {
  // get the new data
  const updatedData = await this.model.findById(this._conditions._id, 'images')
  // loop through old data images
  doc.images.forEach(async image => {
    // search the new data to see if the image is there or not
    const result = updatedData.images.find(img => img.id === image.id)
    // return if new data has the same image
    if (result) return
    // delete the image from storage if it not in the new data
    await deleteObject(ref(storage, `images/${image.id}`))
  })
})

export default models.Campground || model('Campground', campgroundSchema)
