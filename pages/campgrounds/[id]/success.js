import { getCampground } from '../../../util/campgrounds'
import illu from '../../../public/illustrations/girl_riding_bike.png'
import Image from 'next/image'

const success = ({ campground }) => {
  return (
    <section className='relative my-5 grid place-items-center md:my-10 md:grid-cols-2'>
      <div>
        <h1 className=''>Trip Confirmed!</h1>
        <p className='my-5 text-xl md:text-2xl'>
          Enjoy your trip to{' '}
          <span className='font-volkhov text-2xl text-brand md:text-3xl'>
            {campground.name}
          </span>
        </p>
      </div>
      <Image src={illu} />
    </section>
  )
}

export async function getServerSideProps({ params }) {
  const campground = await getCampground(params.id, false, false)

  return {
    props: { campground },
  }
}

export default success
