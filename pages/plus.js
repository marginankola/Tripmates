import { FaCheck } from 'react-icons/fa'
import { getSession, useSession } from 'next-auth/react'
import { getUser } from '../util/user'

export default function Subscription({ subscribed }) {
  const { data: session } = useSession()

  const includedFeatures = [
    'Access to exclusive campsites',
    'Discounts on campsite fees',
    'Ability to save and share favorite campsites',
    'No cancellation fees for premium members',
    'Priority booking for popular campsites during peak seasons',
  ]

  return (
    <section className='w-full pt-10 lg:gap-6 lg:pt-12'>
      <div className='mx-auto w-full lg:py-16 lg:px-6'>
        <div className='mx-auto mb-5 w-full text-center lg:mb-12'>
          <h2 className='mb-5 font-volkhov text-4xl font-extrabold tracking-tight '>
            {!subscribed
              ? 'Get exclusive benefits with '
              : 'You are already subscribed to '}
            <span className='text-brand'>Tripmates Plus</span>
          </h2>
          <p className='font-light text-paragraph md:text-lg'>
            {!subscribed
              ? 'Unlock exclusive access to top-rated campgrounds and enjoy personalized booking experiences with our premium membership.'
              : 'As a valued premium member, you get ready to access exclusive features and elevate your camping experience'}
          </p>
        </div>
        {/* <!-- Pricing Card --> */}
        <PricingCard
          subscribed={subscribed}
          includedFeatures={includedFeatures}
          checkOutLink={`/api/subscribe?email=${session?.user?.email}`}
        />
      </div>
    </section>
  )
}

const PricingCard = ({ subscribed, includedFeatures, checkOutLink }) => {
  return (
    <div className='mx-auto mt-10 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none'>
      <div className='p-8 sm:p-10 lg:flex-auto'>
        <h3 className='text-2xl font-bold tracking-tight text-dark'>
          Tripmates Plus
        </h3>
        <p className='mt-6 text-base leading-7 text-paragraph'>
          Upgrade your camping experience with exclusive access and personalized
          service - become a premium member today!
        </p>
        <div className='mt-10 flex items-center gap-x-4'>
          <h4 className='flex-none text-sm font-semibold leading-6 text-brand'>
            What&apos;s included
          </h4>
        </div>
        <ul
          role='list'
          className='mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-paragraph sm:grid-cols-2 sm:gap-6'
        >
          {includedFeatures.map(feature => (
            <li key={feature} className='flex gap-x-3'>
              <FaCheck
                className='h-6 w-5 flex-none text-brand'
                aria-hidden='true'
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {!subscribed && (
        <div className='-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0'>
          <div className='h-full rounded-2xl bg-secondaryBg py-10 text-center ring-1 ring-inset ring-dark/5 lg:flex lg:flex-col lg:justify-center lg:py-16'>
            <div className='mx-auto max-w-xs px-8'>
              <p className='text-base font-semibold text-paragraph'>
                Become a Plus Member
              </p>
              <p className='mt-6 flex items-baseline justify-center gap-x-2'>
                <span className='text-5xl font-bold tracking-tight text-dark'>
                  ₹12999
                </span>
                <span className='text-sm font-semibold leading-6 tracking-wide text-paragraph'>
                  /year
                </span>
              </p>
              <a
                href={checkOutLink}
                className='mt-10 block w-full rounded-md bg-brand px-3 py-2 text-center text-sm font-semibold text-primaryBg shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
              >
                Get access
              </a>
              <p className='mt-6 text-xs leading-5 text-paragraph'>
                Invoices and receipts available for easy company reimbursement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session)
    return {
      props: { subscribed: false },
    }

  const user = await getUser(session.user.id)
  const subscribed = user.premium.subscribed || false

  return {
    props: { subscribed },
  }
}
