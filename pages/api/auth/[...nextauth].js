import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '../../../models/User'
import connectDB from '../../../util/mongo'
import { compare } from 'bcryptjs'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        await connectDB()

        // Check if the user exists
        const user = await User.findOne({ email: credentials.email })

        // If does not exists then throw error
        if (!user) throw new Error('Invalid email or password!')
        // Check auth type, if it does not include 'credentials' then throw error
        if (user.auth_type.indexOf('credentials') < 0)
          throw new Error('Invalid email or password!')
        // If user exists then check password
        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        )
        // If password is wrong then throw error
        if (!isPasswordCorrect) throw new Error('Invalid email or password!')
        // On correct password return the user
        return user
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account: { provider } }) {
      await connectDB()
      // Check if user with email exists
      const userInDB = await User.findOne({ email: user.email })
      // if exists and the auth type already has provider then return
      if (userInDB && userInDB.auth_type.indexOf(provider) >= 0) return true
      // If exists and the provider is not in auth_type then add it
      if (userInDB && userInDB.auth_type.indexOf(provider) < 0) {
        userInDB.auth_type.push(provider)
        await userInDB.save()
        return true
      }
      // Otherwise add the user to DB
      const userToCreate = {
        name: user.name,
        image: user.image,
        email: user.email,
        auth_type: [provider],
        premium: { subscribed: false },
      }
      await User.create(userToCreate)
      return true
    },
    async session({ session }) {
      await connectDB()

      const email = session.user.email
      const { _id } = await User.findOne({ email }, { _id: true })

      session.user.id = _id

      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
