import Link from 'next/link'
import logo from '../public/logo.svg'
import Image from 'next/image'
import dayjs from 'dayjs'

const Footer = () => {
  return (
    <footer className='bg-bleed-lightBlue absolute bottom-0 w-[calc(100%-4rem)] translate-y-full bg-lightBlue py-10 sm:w-[calc(100%-5rem)] md:w-[calc(100%-6rem)] lg:w-[calc(100%-7rem)] lg:py-16'>
      <div className='flex flex-col gap-8 lg:flex-row'>
        <div className='flex flex-col gap-4 lg:flex-1 lg:gap-8'>
          <div className='flex items-center gap-2'>
            <h3 className='font-volkhov text-3xl'>Tripmates</h3>
            <Image src={logo} className='w-10' />
          </div>
          <p>Providing excellent campging experience since 2024</p>
        </div>
        <ul className='flex flex-col gap-2 lg:flex-1 lg:gap-4'>
          <h4 className='mb-4 font-volkhov text-xl'>Links</h4>
          <li>
            <Link className='hover:text-brand' href={'/'}>
              Home
            </Link>
          </li>
          <li>
            <Link className='hover:text-brand' href={'/campgrounds'}>
              Campgrounds
            </Link>
          </li>
          <li>
            <Link className='hover:text-brand' href={'/plus'}>
              Tripmates Plus
            </Link>
          </li>
        </ul>
      </div>
      <div className='my-8 max-w-full border-b border-dark lg:my-10' />
      <div className='flex flex-col justify-between gap-4 md:flex-row'>
        <p>Copyright &copy;, Tripmates {dayjs().year()}. All rights reserved.</p>
        <Link
          href={'campgrounds/terms-and-conditions'}
          className='text-text hover:text-brand'
        >
          Terms and Conditions
        </Link>
      </div>
    </footer>
  )
}

export default Footer
