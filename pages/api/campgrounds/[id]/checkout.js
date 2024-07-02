import Stripe from 'stripe'
import connectDB from '../../../../util/mongo'
import Campground from '../../../../models/Campground'
import User from '../../../../models/User'

export default async function handler(req, res) {
  const PAISA_TO_RUPEES = 100

  if (req.method === 'GET') {
    await connectDB()
    const {
      id: campId,
      adults,
      children,
      infants,
      days,
      checkIn,
      checkOut,
      user: userId,
    } = req.query

    const { email, premium } = await User.findById(userId, 'email premium')

    const camp = await Campground.findById(campId)
    const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY)
    let amount =
      (camp.price.adults * adults + camp.price.children * children) * days

    if (premium.subscribed) {
      amount *= 0.8
    }

    if (camp.price.discount > 0) {
      amount *= (100 - camp.price.discount) / 100
    }

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'inr',
              product_data: {
                name: camp.name,
              },
              unit_amount: amount.toFixed() * PAISA_TO_RUPEES,
            },
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL}/campgrounds/${camp._id}/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/campgrounds/${camp._id}`,
        metadata: {
          checkIn,
          checkOut,
          user: userId,
          camp: camp._id.toString(),
          owner: camp.owner.toString(),
          adults,
          children,
          infants,
        },
      })
      res.redirect(303, session.url)
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message)
    }
  }
}
