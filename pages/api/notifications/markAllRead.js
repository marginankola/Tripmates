import User from '../../../models/User'
import connectDB from '../../../util/mongo'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectDB()

    const { user } = req.body

    try {
      await User.findByIdAndUpdate(user, {
        $set: { 'notifications.$[].read': true },
      })
      res.status(200).send(true)
    } catch (e) {
      res.status(500).send(false)
    }
  }
}
