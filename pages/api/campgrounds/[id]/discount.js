import Campground from '../../../../models/Campground'
import connectDb from '../../../../util/mongo'

export default async function handler(req, res) {
  await connectDb()

  if (req.method === 'PATCH') {
    const { id, discount } = req.body
    try {
      await Campground.findByIdAndUpdate(id, {
        $set: { 'price.discount': discount },
      })
      return res.status(200).send(true)
    } catch (e) {
      return res.status(500).send(false)
    }
  }
}
