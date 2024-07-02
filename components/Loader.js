import Image from 'next/image'
import loader from '../public/loader.gif'

const Loader = () => {
  return (
    <div className='flex h-[calc(100vh-96px)] w-full flex-col items-center justify-center gap-2'>
      <Image src={loader} className='w-44' />
      <p>Loading...</p>
    </div>
  )
}

export default Loader
