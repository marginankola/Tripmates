import Stripe from 'stripe'

export default async function handler(req, res) {
  const PAISA_TO_RUPEES = 100
  const { email } = req.query
  if (req.method === 'GET') {
    const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY)

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        customer_email: req.query.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              recurring: {
                interval: 'year',
              },
              currency: 'inr',
              product_data: {
                name: 'YelpCamp Premium',
              },
              unit_amount: 12999 * PAISA_TO_RUPEES,
            },
          },
        ],
        subscription_data: {
          metadata: {
            email,
          },
        },
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/campgrounds/`,
      })
      res.redirect(303, session.url)
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message)
    }
  }
}
