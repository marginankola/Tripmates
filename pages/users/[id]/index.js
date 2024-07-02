import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import CampgroundWideCard from '../../../components/CampgroundWideCard'
import { useState } from 'react'
import Reviews from '../../../components/Reviews'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { FaCheck, FaRupeeSign } from 'react-icons/fa'
import ReviewForm from '../../../components/ReviewForm'
import Campground from '../../../models/Campground'
import dayjs from 'dayjs'
import Link from 'next/link'
import LinkButton from '../../../components/LinkButton'
import CampgroundListItem from '../../../components/CampgroundListItem'
import Review from '../../../models/Review'
import User from '../../../models/User'
import { MdVerified } from 'react-icons/md'
import Modal from '../../../components/Modal'
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoWarningOutline,
} from 'react-icons/io5'

const Campgrounds = ({ user, session }) => {
  const deleteCampground = async id => {
    const { data: deletedCampground } = await axios.delete(
      `/api/campgrounds/${id}`
    )
    toast.success(
      () => (
        <>
          Successfully deleted{' '}
          <span className='font-semibold'>{deletedCampground?.name}</span>
        </>
      ),
      {
        icon: FaCheck,
      }
    )
  }

  if (user.campgrounds.length === 0)
    return (
      <p>
        You have not hosted any campground on Tripmates!{' '}
        <Link href={'/campgrounds/new'} className='text-blue'>
          Host
        </Link>{' '}
        now and get more campers!
      </p>
    )

  const renderCamps = () =>
    user.campgrounds.map(campground => (
      <li key={campground.campground._id}>
        <CampgroundListItem
          campground={campground.campground}
          deleteCampground={deleteCampground}
          showEditDeleteBtns={session?.user.id === user._id}
        />
      </li>
    ))
  return <ul className='flex w-full flex-col gap-12'>{renderCamps()}</ul>
}

const ReviewsSection = ({ camps, user, session }) => {
  const [showNewReviewForm, setShowNewReviewForm] = useState(false)

  const handleSubmit = async (e, id, rating) => {
    e.preventDefault()
    const data = {
      text: e.target.text.value,
      user: session.user.id,
      campground: id,
      rating,
    }

    const res = await axios.post(
      `/api/campgrounds/${id.toString()}/review`,
      data
    )
    setShowNewReviewForm(false)
    toast.success('Review Added!', { icon: FaCheck })
  }

  if (!session || user._id !== session.user.id) {
    return (
      <div>
        <h5 className='font-volkhov text-xl lg:text-2xl'>Past Reviews</h5>
        <Reviews onProfilePage={true} data={user.reviews} />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h5 className='mb-3 font-volkhov text-xl lg:text-2xl'>New Review</h5>
        {showNewReviewForm && (
          <ReviewForm
            setShowForm={setShowNewReviewForm}
            camps={camps}
            handleSubmit={handleSubmit}
          />
        )}
        {!!camps.length ? (
          <button
            onClick={() => setShowNewReviewForm(true)}
            className='text-blue'
          >
            Click to write a new Review
          </button>
        ) : (
          <p>
            No Campground to Review yet.{' '}
            <Link href={'/campgrounds'} className='text-blue'>
              Book a trip now
            </Link>
          </p>
        )}
      </div>
      <div>
        <h5 className='font-volkhov text-xl lg:text-2xl'>Past Reviews</h5>
        <Reviews onProfilePage={true} data={user.reviews} />
      </div>
    </div>
  )
}

const PastTrips = ({ camps, user }) => {
  if (!camps?.length)
    return (
      <p>
        You have not gone to any Campground yet.{' '}
        <Link href={'/campgrounds'} className='text-blue'>
          Book a campground now
        </Link>
      </p>
    )
  return (
    <div>
      <h5 className='mb-5 font-volkhov text-xl lg:text-2xl'>Past Trips</h5>
      {camps.map(camp => {
        const trip = user.trips.find(trip => trip.campground._id === camp._id)
        return (
          <CampgroundWideCard
            key={camp._id}
            campground={camp}
            showCancel={dayjs().isBefore(dayjs(trip.checkIn))}
            tripDetails={trip}
          />
        )
      })}
    </div>
  )
}

const Earnings = ({ user }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()
  const [showCardDetails, setShowCardDetails] = useState(false)

  if (!user.campgrounds.length)
    return (
      <p>
        You have not hosted any campground on Tripmates!{' '}
        <Link href={'/campgrounds/new'} className='text-blue'>
          Host
        </Link>{' '}
        now and start earning!
      </p>
    )

  const amount = user.campgrounds
    .map(camp => camp.earnings)
    .reduce((acc, curr) => acc + curr, 0)

  const handleWithdraw = async () => {
    try {
      await axios.post('/api/withdraw', { user: user._id })
      router.push(`/users/${user._id}`)
      toast.success('Withdraw request success')
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='flex flex-col gap-8 md:flex-row'>
      <Modal
        text={
          'Are you sure want to widthdraw all the balance from your account? After you withdraw it may take upto 5 business days for the funds to be transferred to your account.'
        }
        title={`Are you sure want to withdraw ₹${amount}`}
        open={showConfirm}
        setOpen={setShowConfirm}
        onAgree={handleWithdraw}
      />
      <div className='flex-1'>
        <h5 className='mb-5 font-volkhov text-xl lg:text-2xl'>Balance</h5>
        <p className='flex items-center font-volkhov text-3xl'>
          <FaRupeeSign className='text-brand' /> {amount}
        </p>
        <h5 className='mb-5 mt-5 font-volkhov text-xl lg:text-2xl'>Summary</h5>
        <ul className='flex flex-col gap-2'>
          {user.campgrounds.map(camp => (
            <li className='md:text-xl' key={camp.campground._id}>
              <span>{camp.campground.name}</span> -{' '}
              <span className='inline-flex items-center'>
                <FaRupeeSign className='text-brand' />
                {camp.earnings}
              </span>
            </li>
          ))}
        </ul>
        <div className='mt-10'>
          {amount >= 5000 ? (
            user?.bank?.acc_no ? (
              <button
                className='rounded-lg bg-brand p-3 text-primaryBg shadow-lightRed transition-all hover:scale-110 hover:shadow-lg lg:p-4 lg:text-lg'
                onClick={() => setShowConfirm(true)}
              >
                Withdraw
              </button>
            ) : (
              <p className='flex items-center gap-1'>
                <IoWarningOutline />
                Please enter your bank details in order to withdraw
              </p>
            )
          ) : (
            <p className='flex items-center gap-1'>
              <IoWarningOutline />
              Earn atleast ₹5000 to withdraw
            </p>
          )}
        </div>
      </div>
      <div className='flex-1'>
        <h5 className='mb-5 flex items-center gap-2 font-volkhov text-xl lg:text-2xl'>
          Account Details{' '}
          {user?.bank?.acc_no && (
            <div
              className='cursor-pointer'
              onClick={() => setShowCardDetails(prev => !prev)}
              title={`${showCardDetails ? 'Hide details' : 'Show details'}`}
            >
              {showCardDetails ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
          )}
        </h5>
        {user?.bank?.acc_no ? (
          <div className='flex flex-col gap-3'>
            <p className='text-lg'>
              <span className='font-volkhov'>Card Number:</span>{' '}
              <span
                className={`${
                  showCardDetails ? 'blur-none' : 'blur-sm'
                } transition-all`}
              >
                {user?.bank?.acc_no}
              </span>
            </p>
            <p className='text-lg'>
              <span className='font-volkhov'>IFSC Number:</span>{' '}
              <span
                className={`${
                  showCardDetails ? 'blur-none' : 'blur-sm'
                } transition-all`}
              >
                {user?.bank?.ifsc_no}
              </span>
            </p>
            <p className='text-lg'>
              <span className='font-volkhov'>Card Holder Name:</span>{' '}
              <span
                className={`${
                  showCardDetails ? 'blur-none' : 'blur-sm'
                } transition-all`}
              >
                {user?.bank?.acc_holder_name}
              </span>
            </p>
          </div>
        ) : (
          <p>
            You have not yet entered your account details. Please do so{' '}
            <Link href={'/users/account_details'} className='text-blue'>
              here
            </Link>{' '}
            in order to withdraw future payments.
          </p>
        )}
      </div>
    </div>
  )
}

const Profile = ({ user, camps, allCamps }) => {
  const { data: session } = useSession()
  const router = useRouter()

  const tabOptions = [
    {
      title: 'hosted campgrounds',
      component: <Campgrounds user={user} session={session} />,
      restricted: false,
    },
    {
      title: 'reviews',
      component: <ReviewsSection camps={camps} user={user} session={session} />,
      restricted: false,
    },
    {
      title: 'trips',
      component: <PastTrips camps={allCamps} user={user} />,
      restricted: true,
    },
    {
      title: 'earnings',
      component: <Earnings user={user} />,
      restricted: true,
    },
  ]

  const [tab, setTab] = useState(
    tabOptions.find(opt => opt.title === router.query.tab) || tabOptions[0]
  )

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <section className='relative'>
      <Head>
        <title>{user.name}&apos;s Profile</title>
      </Head>
      <section className='flex flex-col gap-6 py-10 lg:gap-16 lg:py-16'>
        <div className='flex flex-col justify-between gap-6 md:flex-row md:items-center'>
          <div className='flex items-center gap-4'>
            <Image
              alt={user.name}
              src={user.image}
              width='100'
              height='100'
              className='aspect-square w-20 rounded-full border-2 border-brand lg:w-24'
            />
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='font-volkhov text-2xl'>{user.name}</h2>
                {user.premium.subscribed && (
                  <MdVerified
                    className='inline text-xl text-brand'
                    title='YelpCamp Plus member'
                  />
                )}
              </div>
              <p className='text-sm text-paragraph'>
                Joined in {user.createdAt.slice(0, 4)}
              </p>
              {user.premium.subscribed && (
                <Link href={'/plus'} className='mt-4 block text-brand'>
                  Tripmates Plus member
                </Link>
              )}
            </div>
          </div>
          {session?.user.id === user._id && (
            <LinkButton
              linkTo='/campgrounds/new'
              className='w-fit'
              text='Host a Campground'
            />
          )}
        </div>

        <section>
          <div className='mb-12 flex w-full gap-3 overflow-x-scroll rounded-lg bg-lightRed p-2 lg:mb-16'>
            {tabOptions
              .filter(option => {
                if (session?.user.id === user._id) return true

                return !option.restricted
              })
              .map((tabOption, i) => (
                <button
                  key={tabOption.title}
                  className={`rounded-lg p-3 capitalize text-dark transition-transform  active:scale-90 ${
                    !(tab.title === tabOptions[i].title) &&
                    'hover:bg-secondaryBg hover:opacity-90'
                  } ${
                    tab.title === tabOptions[i].title &&
                    'bg-primaryBg !text-dark'
                  }`}
                  onClick={() => setTab(tabOptions[i])}
                >
                  {tabOption.title}
                </button>
              ))}
          </div>
          {
            tabOptions.find(tabOption => tabOption.title === tab.title)
              .component
          }
        </section>
      </section>
    </section>
  )
}

export async function getServerSideProps({ params }) {
  const userId = params.id
  await Review.find({})

  const user = await User.findById(userId).populate(
    'campgrounds.campground trips.campground reviews'
  )

  await user.populate('reviews.campground', 'name')
  await user.populate('reviews.user', 'name')

  const eligibleTrips = user.trips?.filter(trip =>
    dayjs().isAfter(dayjs(trip.checkOut))
  )

  const campIds = eligibleTrips.map(trip => trip.campground)
  const camps = await Campground.find({ _id: { $in: campIds } })

  const allTrips = user.trips?.map(trip => trip.campground)
  const allCamps = await Campground.find({ _id: { $in: allTrips } })

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      camps: JSON.parse(JSON.stringify(camps)) || [],
      allCamps: JSON.parse(JSON.stringify(allCamps)),
    },
  }
}

export default Profile
