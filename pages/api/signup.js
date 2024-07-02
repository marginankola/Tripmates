import connectDB from '../../util/mongo'
import User from '../../models/User'
import { hash } from 'bcryptjs'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    // Extract the required data from the body
    const { username: name, email, password } = req.body

    // check if user already exists
    const userExists = await User.exists({ email })
    if (userExists)
      return res.status(422).send({ message: 'User with email already exists' })

    // check if username is already taken already exists
    const duplicateUsername = await User.exists({ name })
    if (duplicateUsername)
      return res.status(422).send({ message: 'Username already in use' })

    const user = await User.create({
      name,
      email,
      password: await hash(password, 14),
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
      auth_type: ['credentials'],
      premium: { subscribed: false },
    })

    return res.status(200).json(user)
  }
}
