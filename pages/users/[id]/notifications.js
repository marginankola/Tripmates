import { getSession } from 'next-auth/react'
import Campground from '../../../models/Campground'
import Review from '../../../models/Review'
import User from '../../../models/User'
import connectDB from '../../../util/mongo'
import { Router, useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FaCheck } from 'react-icons/fa'
import { AiOutlineClear } from 'react-icons/ai'
import axios from 'axios'
import { toast } from 'react-toastify'

const Notifications = ({ notifications, autorized = false, user }) => {
  const router = useRouter()

  if (!autorized) return router.push('/')

  dayjs.extend(localizedFormat)
  dayjs.extend(relativeTime)

  const clear = async () => {
    try {
      await axios.post('/api/notifications/clear', { user })
      router.reload()
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/markAllRead', { user })
      router.reload()
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  return (
    <section className='mt-6'>
      <div className='mb-6 flex flex-col gap-2 md:flex-row md:justify-between'>
        <h3 className='font-volkhov text-2xl'>Notifications</h3>
        <div className='flex gap-4'>
          <button className='flex items-center gap-1' onClick={clear}>
            <AiOutlineClear />
            Clear
          </button>
          <button className='flex items-center gap-1' onClick={markAllAsRead}>
            <FaCheck />
            Mark all as read
          </button>
        </div>
      </div>
      <ul className='flex flex-col gap-4'>
        {notifications.length ? (
          notifications.map(noti => (
            <li
              key={noti._id}
              className={`relative ${
                noti.read ? 'opacity-80' : 'opacity-100'
              } flex items-center gap-4 rounded-lg bg-lightBlue p-4`}
            >
              {!noti.read && (
                <div className='absolute top-0 right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand'></div>
              )}
              <div className='hidden md:block'>
                <Image
                  src={noti.campground.images[0].url}
                  width='225'
                  height='100'
                  className='h-full w-auto rounded-lg'
                  alt={`Image of ${noti.campground.name}`}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-sm text-text'>
                  {dayjs().to(dayjs(noti.createdAt))}
                </p>
                <p className='text-lg lg:text-xl'>
                  User{' '}
                  <Link
                    href={`/users/${noti.user._id}`}
                    className='font-volkhov text-brand'
                  >
                    {noti.user.name}
                  </Link>{' '}
                  made a booking for{' '}
                  <Link
                    href={`/campgrounds/${noti.campground._id}`}
                    className='font-volkhov text-brand'
                  >
                    {noti.campground.name}
                  </Link>
                </p>
                <p>
                  Guests:{' '}
                  {`${noti.guests.adults} adults${
                    !!noti.guests.children
                      ? ', ' + noti.guests.children + ' children'
                      : ''
                  } ${
                    !!noti.guests.infants
                      ? ', ' + noti.guests.infants + ' infants'
                      : ''
                  }`}
                </p>
                <div>
                  <p>Check In: {dayjs(noti.dates.checkIn).format('LL')}</p>{' '}
                  <p>Check Out: {dayjs(noti.dates.checkOut).format('LL')}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No new notifications</p>
        )}
      </ul>
    </section>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session?.user.id || session?.user.id !== context.params.id)
    return { props: { autorized: false } }

  await connectDB()
  await Campground.find({})
  await Review.find({})

  const { notifications } = await User.findById(
    context.params.id,
    'notifications'
  )
    .populate('notifications.campground', 'name images')
    .populate('notifications.user', 'name')

  return {
    props: {
      notifications: JSON.parse(JSON.stringify(notifications)),
      autorized: true,
      user: context.params.id,
    },
  }
}

export default Notifications
