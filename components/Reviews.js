import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

const Reviews = ({ data, onProfilePage = false }) => {
  if (!data.length) {
    return onProfilePage ? (
      <p>User has not reviewed any campground yet.</p>
    ) : (
      <p>This campground has no reviews yet.</p>
    )
  }

  dayjs.extend(localizedFormat)

  const renderReviews = () =>
    data.map(review => (
      <Review key={review._id} data={review} onProfilePage={onProfilePage} />
    ))

  return (
    <ul className='grid gap-10 py-3 lg:grid-cols-2 lg:gap-20'>
      {renderReviews()}
    </ul>
  )
}

const Review = ({ onProfilePage, data }) => {
  return (
    <div>
      <div className='mb-3 flex gap-3'>
        {!onProfilePage && (
          <Image
            src={data.user.image}
            width={'50'}
            height={'50'}
            className='rounded-full'
            alt={data.user.name}
          />
        )}
        <div className='flex flex-col'>
          <h5 className='font-medium'>
            {onProfilePage && <span className='font-normal'>Reviewed </span>}
            {onProfilePage ? (
              <Link href={`/campgrounds/${data.campground._id}`}>
                {data.campground.name}
              </Link>
            ) : (
              <Link href={`/users/${data.user._id}`}>{data.user.name}</Link>
            )}
          </h5>
          <p className='text-sm'>{dayjs(data.createdAt).format('ll')}</p>
        </div>
      </div>
      <p>{data.text}</p>
    </div>
  )
}

export default Reviews
