import Image from 'next/image'
import Link from 'next/link'
import { HiStar, HiMapPin } from 'react-icons/hi2'
import { FaRupeeSign } from 'react-icons/fa'
import LinkButton from './LinkButton'

const CampgroundCard = ({ campground }) => {
  return (
    <div
      key={campground._id}
      className='group relative flex flex-col gap-3 rounded-xl border border-lightBlue shadow-lg shadow-lightBlue hover:shadow-lg hover:shadow-lightRed'
    >
      {(campground.price.discount > 0 || campground.plusExclusive) && (
        <p className='absolute top-0 right-0 z-[2] w-fit -translate-x-1/3 translate-y-1/2 rounded-md bg-lightRed py-1 px-2 font-medium text-brand'>
          {campground.price.discount > 0 && (
            <span>-{campground.price.discount}%</span>
          )}
          {campground.plusExclusive && (
            <span> {campground.price.discount > 0 && <>&middot;</>} Plus</span>
          )}
        </p>
      )}
      <div className='relative'>
        <Image
          src={campground.images[0].url}
          width='450'
          height='450'
          className='h-80 w-full rounded-xl object-cover'
          alt={campground.name}
        />
        <LinkButton
          text='View More'
          linkTo={`/campgrounds/${campground._id}`}
          className='absolute right-1/2 bottom-4 w-fit translate-x-1/2 px-4 opacity-0 shadow-md lg:hover:border-primaryBg lg:hover:bg-primaryBg lg:group-hover:opacity-100'
        />
      </div>
      <div className='p-5'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl'>{campground.name}</h2>
          <p className='flex items-center gap-1 text-paragraph'>
            <HiStar className='text-yellow' /> {campground.rating || '?'}
          </p>
        </div>
        <div className='mb-2 flex items-center justify-between'>
          <p className='inline-flex items-center gap-1 text-paragraph'>
            <HiMapPin />
            {campground.location.country}
          </p>
          <div className='flex items-center gap-1'>
            {campground.price.discount > 0 && (
              <p className='text-text line-through'>
                <FaRupeeSign className='inline' />
                {campground.price.adults}
              </p>
            )}
            <p className='w-fit rounded-md bg-[#FFE7DB] py-1 px-2 font-medium text-brand'>
              <FaRupeeSign className='inline' />
              {campground.price.discount > 0
                ? (
                    campground.price.adults *
                    ((100 - campground.price.discount) / 100)
                  ).toFixed()
                : campground.price.adults}
            </p>
          </div>
        </div>
        <Link
          href={`/campgrounds/${campground._id}`}
          className='text-brand lg:hidden'
        >
          View More
        </Link>
      </div>
    </div>
  )
}

export default CampgroundCard
