import Link from 'next/link'
import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5'
import { TbDiscount2 } from 'react-icons/tb'
import { HiStar } from 'react-icons/hi2'
import Modal from './Modal'
import { useState } from 'react'
import { useRouter } from 'next/router'
import ModalInput from './ModalInput'
import { toast } from 'react-toastify'
import axios from 'axios'
import Image from 'next/image'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

const CampgroundListItem = ({
  campground,
  deleteCampground,
  showEditDeleteBtns,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const router = useRouter()

  dayjs.extend(localizedFormat)

  const handleDiscountSubmit = async val => {
    const success = await axios.patch(
      `/api/campgrounds/${campground._id}/discount`,
      { id: campground._id, discount: val.discount }
    )
    if (!success)
      return toast.error('Something went wrong, please try again later.')
    toast.success('Success')
  }

  return (
    <div className='group relative flex flex-col justify-between gap-4 rounded-lg bg-lightBlue p-4 hover:shadow-md hover:shadow-lightRed sm:flex-row sm:justify-start sm:gap-8'>
      {campground.price.discount > 0 && (
        <p className='absolute top-0 right-0 z-[2] w-fit translate-x-1/2 -translate-y-1/2 rounded-md bg-lightRed py-1 px-2 font-medium text-brand md:text-lg'>
          -{campground.price.discount}%
        </p>
      )}
      {showDiscountModal && (
        <ModalInput
          handleSubmit={handleDiscountSubmit}
          open={showDiscountModal}
          setOpen={setShowDiscountModal}
          title={`Create a discount on ${campground.name}?`}
          text={`If you create a discount on ${campground.name}, it will stay on discounted price untill discount not manually removed. If you want to continue then simply enter the percentage discount you'd like to offer below, and we'll take care of the rest. If you want to remove discount then simply enter 0 below.`}
          defaultValue={campground.price.discount}
        />
      )}
      {deleteConfirm && (
        <Modal
          open={deleteConfirm}
          setOpen={setDeleteConfirm}
          title={`Delete ${campground.name}`}
          text={
            'This cannot be undone! All of the data associated with the campground will also be deleted! Are you sure want to delete?'
          }
          onAgree={() => deleteCampground(campground._id)}
        />
      )}
      <Image
        src={campground.images[0].url}
        alt={campground.name}
        width={200}
        height={200}
        className='w-full rounded-lg sm:max-w-xs'
      />
      <div className='flex flex-col gap-6 sm:w-full sm:justify-between sm:p-4'>
        <div>
          <div className='flex items-center justify-between'>
            <h4 className='font-volkhov text-xl group-hover:text-brand sm:text-3xl'>
              <Link href={`/campgrounds/${campground._id}`}>
                {campground.name}
              </Link>{' '}
            </h4>
            <span className='inline-flex items-center text-xl group-hover:text-brand'>
              {campground.rating || '?'}
              <HiStar />
            </span>
          </div>
          <p className='mt-2 text-text'>
            Hosted on {dayjs(campground.createdAt).format('LL')}
          </p>
        </div>
        {!showEditDeleteBtns && (
          <p className='max-w-prose break-words'>{campground.desc}</p>
        )}
        {showEditDeleteBtns && (
          <div className='flex justify-end gap-6 sm:justify-start'>
            <button
              title='Create a discount'
              onClick={() => setShowDiscountModal(true)}
            >
              <TbDiscount2 size='2em' className='group-hover:text-blue' />
            </button>
            <button
              onClick={() => router.push(`/campgrounds/${campground._id}/edit`)}
            >
              <IoCreateOutline size='2em' className='group-hover:text-brand' />
            </button>
            <button onClick={() => setDeleteConfirm(true)}>
              <IoTrashOutline size='2em' className='group-hover:text-red' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampgroundListItem
