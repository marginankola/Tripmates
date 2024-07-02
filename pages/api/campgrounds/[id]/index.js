import Campground from '../../../../models/Campground'
import connectDb from '../../../../util/mongo'

export default async function handler(req, res) {
  await connectDb()

  // Check method of req
  // For PATCH req
  if (req.method === 'PATCH') {
    // Get the id and new data
    const { id } = req.query
    // Update the campground
    const campground = await Campground.findByIdAndUpdate(id, req.body)
    // Return data with status 200
    return res.status(200).json(campground)
  }
  // For DELETE req
  if (req.method === 'DELETE') {
    // Get the campground id
    const { id } = req.query
    // Delete the campground
    const deletedCampground = await Campground.findByIdAndDelete(id)
    // Return the deleted campground with status 200
    return res.status(200).json(deletedCampground)
  }
}
