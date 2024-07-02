import connectDb from '../../util/mongo'
import Campground from '../../models/Campground'
import User from '../../models/User'
import Review from '../../models/Review'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectDb()

      await Campground.find({})
      await Review.find({})

      await User.findByIdAndUpdate(req.body.user, { $set: { bank: req.body } })

      res.status(200).send(true)
    } catch (e) {
      res.status(500).send(false)
    }
  }
}
