import Campground from '../../models/Campground'
import Review from '../../models/Review'
import User from '../../models/User'
import connectDb from '../../util/mongo'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user } = req.body

    await connectDb()
    await Review.find({})
    await Campground.find({})

    await User.findByIdAndUpdate(user, {
      $set: { 'campgrounds.$[].earnings': 0 },
    })

    res.status(200).send('Success')
  }
}
