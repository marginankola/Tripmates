import Image from 'next/image'
import Link from 'next/link'
import Modal from './Modal'
import { HiStar, HiMapPin, HiChevronRight } from 'react-icons/hi2'
import { FaRupeeSign } from 'react-icons/fa'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

const CampgroundWideCard = ({ campground, showCancel, tripDetails }) => {
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)
  const { data: session } = useSession()

  dayjs.extend(localizedFormat)

  const refund = async () => {
    const res = await axios.post('/api/cancelBooking', {
      user: session.user.id,
      tripDetails,
    })

    if (res.status === 200) {
      toast.success(
        `Reservation to ${campground.name} successfully canceled. You refund will be transferred shortly.`
      )
    } else {
      toast.error(`Something went wrong! Please try again later.`)
    }
  }

  return (
    <div
      key={campground._id}
      className='flex flex-col gap-3 rounded-xl border border-lightBlue shadow-lg shadow-lightBlue hover:shadow-lg hover:shadow-lightRed lg:flex-row'
    >
      <Modal
        open={showRefundConfirm}
        setOpen={setShowRefundConfirm}
        title={'Are you sure want to canel this trip?'}
        text={
          'Cancellation fees may apply if you cancel your booking outside of the designated cancellation window. The fee amount is a 15% of your total booking. This fee is charged to cover any expenses incurred as a result of your cancellation. However, if you need to cancel your booking and are a premium user, there will be no cancellation charge.'
        }
        onAgree={refund}
      />
      <div className='relative'>
        <Image
          src={campground.images[0].url}
          width='450'
          height='450'
          className='h-80 w-full rounded-xl object-cover'
          alt={campground.name}
        />
      </div>
      <div className='flex flex-1 flex-col justify-between gap-4 p-5'>
        <div>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-2xl'>{campground.name}</h2>
            <p className='flex items-center gap-1 text-paragraph'>
              <HiStar className='text-yellow' /> {campground.rating || '?'}
            </p>
          </div>
          {/* <p className='max-w-prose break-words'>
            {campground.desc.split(' ').slice(0, 55).join(' ')}...
          </p> */}
          <div>
            <p>Check In: {dayjs(tripDetails.checkIn).format('LL')}</p>
            <p>Check Out: {dayjs(tripDetails.checkOut).format('LL')}</p>
          </div>
          <p className='mt-4'>
            You will stay for{' '}
            {dayjs(tripDetails.checkOut)
              .add(1, 'day')
              .diff(tripDetails.checkIn, 'days')}{' '}
            days
          </p>
        </div>
        <div className='flex w-full items-center justify-between'>
          <p className='inline-flex items-center gap-1 text-paragraph'>
            <HiMapPin />
            {campground.location.country}
          </p>
          <p className='w-fit rounded-md bg-[#FFE7DB] py-1 px-2 font-medium text-brand'>
            <FaRupeeSign className='inline' />
            {tripDetails.charge}
          </p>
        </div>
        <div className='flex justify-between'>
          <Link
            href={`/campgrounds/${campground._id}`}
            className='text-lg text-brand'
          >
            View More
            <HiChevronRight className='inline' />
          </Link>
          {showCancel && (
            <button
              className='text-lg text-red'
              onClick={() => setShowRefundConfirm(true)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampgroundWideCard
