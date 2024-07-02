import { Schema, model, models } from 'mongoose'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    premium: {
      type: {
        subscribed: { type: Boolean, default: false },
      },
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      min: [8, 'Password must be atleast 8 characters'],
    },
    image: {
      type: String,
      required: true,
    },
    auth_type: {
      type: [String],
      enum: ['credentials', 'google', 'facebook'],
      required: true,
    },
    campgrounds: {
      type: [
        {
          earnings: Number,
          campground: { type: Schema.Types.ObjectId, ref: 'Campground' },
        },
      ],
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: 'Review',
    },
    trips: {
      type: [
        {
          checkIn: String,
          checkOut: String,
          campground: {
            type: Schema.Types.ObjectId,
            ref: 'Campground',
          },
          payment_intent: String,
          charge: Number,
        },
      ],
    },
    bank: {
      type: {
        acc_no: Number,
        ifsc_no: Number,
        acc_holder_name: String,
      },
    },
    notifications: {
      type: [
        {
          campground: { type: Schema.Types.ObjectId, ref: 'Campground' },
          user: { type: Schema.Types.ObjectId, ref: 'User' },
          dates: {
            checkIn: String,
            checkOut: String,
          },
          read: Boolean,
          guests: { adults: Number, children: Number, infants: Number },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true }
)

export default models.User || model('User', userSchema)
