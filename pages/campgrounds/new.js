import Head from 'next/head'
import axios from 'axios'
import { useRouter } from 'next/router'
import Form from '../../components/Form'
import Image from 'next/image'
import illustration from '../../public/camping.svg'
import { FaCampground, FaCheck } from 'react-icons/fa'
import { uploadAndGetImgUrls } from '../../util/uploadImage'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useSession, getSession } from 'next-auth/react'
import { getUser } from '../../util/user'

const NewCampground = ({ user }) => {
  const { data: session } = useSession()

  const router = useRouter()
  const [isSubmiting, setIsSubmiting] = useState(false)

  const addCampground = async data => {
    setIsSubmiting(true)
    const images = await uploadAndGetImgUrls(data.images)

    const { data: campground } = await axios.post('/api/campgrounds', {
      ...data,
      images,
      owner: session.user.id,
    })

    toast.success(
      () => (
        <>
          Campground added success fully!{' '}
          <Link href={`/campgrounds/${campground._id}`}>
            <span className='font-semibold'>Click here</span> to view
          </Link>
        </>
      ),
      { icon: FaCheck }
    )
    setIsSubmiting(false)
    router.push('/campgrounds')
  }

  return (
    <>
      <Head>
        <title>Tripmates | New Campground</title>
      </Head>
      <section className='flex items-center gap-16 py-12'>
        <div className='w-full lg:flex-1'>
          <h3 className='mb-10 flex items-center gap-2 text-left font-volkhov text-2xl font-bold text-brand md:gap-4 md:text-3xl lg:text-4xl'>
            <FaCampground />
            Add a Campground
          </h3>
          <Form
            submitForm={addCampground}
            disabled={isSubmiting}
            subscribed={user.premium.subscribed}
          />
        </div>
        {/* <Image
          src={illustration}
          className='hidden max-w-[50%] flex-1 self-center lg:block'
          alt='man campging'
        /> */}
      </section>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  const user = await getUser(session.user.id)

  return {
    props: { user },
  }
}

export default NewCampground
