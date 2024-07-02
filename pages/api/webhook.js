import Stripe from 'stripe'
import { buffer } from 'micro'
import User from '../../models/User'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function webhookHandler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sign = req.headers['stripe-signature']
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
      if (!sign || !webhookSecret) return

      event = stripe.webhooks.constructEvent(buf, sign, webhookSecret)
    } catch (e) {
      console.log(`Webhook error: ${e.message}`)
      return res.status(400).send(`Webhook error: ${e.message}`)
    }

    if (event.type === 'customer.subscription.created') {
      const { email } = event.data.object.metadata

      await User.findOneAndUpdate(
        { email },
        {
          premium: { subscribed: true },
        }
      )
    } else if (event.type === 'checkout.session.completed') {
      const {
        user: userId,
        checkIn,
        checkOut,
        camp,
        owner,
        adults,
        children,
        infants,
      } = event.data.object.metadata

      const trip = {
        checkIn,
        checkOut,
        campground: camp,
        payment_intent: event.data.object.payment_intent,
        charge: event.data.object.amount_total / 100,
      }

      await User.findByIdAndUpdate(userId, {
        $push: { trips: trip },
      })

      await User.updateOne(
        { 'campgrounds.campground': camp },
        {
          $inc: {
            'campgrounds.$.earnings':
              (event.data.object.amount_total / 100) * 0.65,
          },
        }
      )

      const notification = {
        campground: camp,
        user: userId,
        dates: { checkIn, checkOut },
        read: false,
        guests: { adults, children, infants },
      }

      await User.findByIdAndUpdate(owner, {
        $push: { notifications: notification },
      })
    }
    res.status(200).send()
  }
}
