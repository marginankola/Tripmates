import Campground from '../models/Campground'
import User from '../models/User'
import Review from '../models/Review'
import connectDb from './mongo'

export async function getUsers(fields) {
  await connectDb()
  // fetch users from db with only specific fields
  const users = await User.find({}, fields)
  // convert to readable object and return
  return JSON.parse(JSON.stringify(users))
}

export async function getUser(
  id,
  populateCampgrounds = false,
  populateReviews = true
) {
  await connectDb()
  await Campground.findOne({})
  await Review.findOne({})
  // find user with id
  const user = await User.findById(id)
  populateCampgrounds && (await user.populate('campgrounds'))
  populateCampgrounds && (await user.populate('trips.campground'))
  populateReviews &&
    (await user.populate('reviews')) &&
    (await user.populate('reviews.campground'))
  // convert user to JS object and return
  return JSON.parse(JSON.stringify(user))
}
