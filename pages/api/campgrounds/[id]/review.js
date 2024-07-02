import mongoose from 'mongoose'
import connectDB from '../../../../util/mongo'
import Review from '../../../../models/Review'
import Campground from '../../../../models/Campground'
import User from '../../../../models/User'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    // get review data from req object
    const data = req.body
    // create a new review
    const review = await Review.create(data)
    // add review id to user and campground
    await User.findByIdAndUpdate(review.user, {
      $push: { reviews: review._id },
    })
    await Campground.findAndAddReview(review)
    // send success response
    return res.status(200).json(review)
  }
}
