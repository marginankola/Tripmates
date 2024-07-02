import User from '../../models/User'
const stripe = require('stripe')(
  'sk_test_51MdFk4SGiitP8hRj9ukgEycqW5nyGJ1MXeezVT8782VREdpqyClZfXkG7jJWPqsNl1ZxZ3Z0Lst8zqBwyEU65RSa00YtyBJgzV'
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tripDetails, user: userId } = req.body

    const user = await User.findById(userId)

    let amount = tripDetails.charge

    if (!user.premium.subscribed) amount *= 0.85

    const refund = await stripe.refunds.create({
      payment_intent: tripDetails.payment_intent,
      amount,
    })

    if (refund.status !== 'succeeded') return res.status(500).send(refund)

    await User.findByIdAndUpdate(userId, {
      $pull: { trips: { campground: tripDetails.campground } },
    })

    await User.updateOne(
      { 'campgrounds.campground': tripDetails.campground._id },
      {
        $inc: {
          'campgrounds.$.earnings': amount * 0.65 * -1,
        },
      }
    )

    return res.status(200).send(refund)
  }
}
