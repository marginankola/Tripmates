import connectDB from '../../../util/mongo'
import Campground from '../../../models/Campground'
import User from '../../../models/User'

export default async function handler(req, res) {
  // Connect to databse
  await connectDB()

  // Check the method of req
  // If the method is POST
  if (req.method === 'POST') {
    // Create a new Campground
    const campground = await Campground.create(req.body)
    // Add campground id to user
    const user = await User.findById(req.body.owner)
    await user.campgrounds.push({ earnings: 0, campground: campground._id })
    user.save()
    // Send the data back with status 200
    return res.status(200).json('campground')
  }
}
