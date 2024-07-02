import Image from 'next/image'
import Link from 'next/link'
import logo from '../public/logo.png'
import { IoMenu, IoClose, IoNotifications } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'

const Header = () => {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false)
  const [clientWindowHeight, setClientWindowHeight] = useState('')

  const toggleMenu = () => {
    setIsMenuOpen(currIsMenuOpen => !currIsMenuOpen)
  }

  const toggleProfileDropDown = () => {
    setIsProfileDropDownOpen(
      currIsProfileDropDownOpen => !currIsProfileDropDownOpen
    )
  }

  const handleScroll = () => {
    setClientWindowHeight(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  return (
    <header
      className={`${
        clientWindowHeight > 5 && 'shadow-[0_10px_10px_-12px_rgba(0,0,0,0.4)]'
      } sticky top-0 z-40 mx-auto max-w-7xl bg-primaryBg px-8 font-poppins text-dark sm:px-10 md:px-12 lg:px-14 lg:pb-0`}
    >
      {/* <!-- lg+ --> */}
      <nav className='flex h-16 items-center justify-between lg:h-24'>
        <div className='flex-shrink-0'>
          <Link
            href='/'
            title='YelpCamp Home'
            className='flex items-center gap-2'
            onClick={() => setIsMenuOpen(false)}
          >
            <h1 className='inline font-volkhov text-lg font-bold lg:text-2xl'>
              Tripmates
            </h1>
            <Image src={logo} alt='YelpCamp' />
          </Link>
        </div>
        <div className='flex items-center'>
          {!!session?.user && (
            <button className='lg:hidden'>
              <Link href={`/users/${session.user.id}/notifications`}>
                <IoNotifications size={'1.5em'} className='mr-4 text-brand' />
              </Link>
            </button>
          )}
          <button
            type='button'
            className='relative inline-flex rounded-md p-2 text-dark transition-all duration-200 hover:bg-gray-100 focus:bg-gray-100 lg:hidden'
            onClick={toggleMenu}
          >
            {/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
            <IoMenu
              className={`${
                isMenuOpen ? 'scale-0' : 'scale-100'
              } absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transition-transform`}
            />

            {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
            <IoClose
              className={`${
                isMenuOpen ? 'scale-100' : 'scale-0'
              } absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transition-transform`}
            />
          </button>
        </div>

        <div className='hidden lg:mx-auto lg:flex lg:items-center lg:space-x-10'>
          <Link
            href='/'
            title='Home'
            className='text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href='/campgrounds'
            title='View Campgrounds'
            className='text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
            onClick={() => setIsMenuOpen(false)}
          >
            Campgrounds
          </Link>

          <Link
            href='/plus'
            title='Subscription'
            className='text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
            onClick={() => setIsMenuOpen(false)}
          >
            <span className='text-brand'>Tripmates Plus</span>
          </Link>
        </div>
        <div className='hidden items-center justify-center lg:inline-flex lg:space-x-10'>
          {session ? (
            <>
              <div className='relative flex items-center justify-center'>
                <button>
                  <Link href={`/users/${session.user.id}/notifications`}>
                    <IoNotifications
                      size={'1.5em'}
                      className='mr-4 text-brand'
                    />
                  </Link>
                </button>
                <button onClick={toggleProfileDropDown}>
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width='45'
                    height='45'
                    className='cursor-pointer rounded-full border-2 border-brand'
                  />
                </button>

                <ul
                  className={`${
                    isProfileDropDownOpen ? 'scale-100' : 'scale-0'
                  } absolute top-full mt-5 flex w-max origin-top flex-col gap-5 rounded-lg border border-gray-200 bg-secondaryBg p-5 text-dark shadow-md transition-transform`}
                >
                  <li>
                    <Link
                      href={`/users/${session.user.id}`}
                      title='Profile'
                      onClick={() => setIsProfileDropDownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/users/${session.user.id}?tab=reviews`}
                      title='Reviews'
                      onClick={() => setIsProfileDropDownOpen(false)}
                    >
                      Reviews
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/users/${session.user.id}?tab=trips`}
                      title='Your Trips'
                      onClick={() => setIsProfileDropDownOpen(false)}
                    >
                      Your Trips
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/plus'
                      title='Subscription'
                      onClick={() => setIsProfileDropDownOpen(false)}
                    >
                      Tripmates Plus
                    </Link>
                  </li>
                  <li>
                    <button
                      title='Log out'
                      className='border-b-2 border-transparent text-base font-semibold text-brand transition-colors duration-200 hover:border-brand focus:border-brand'
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link
                href='/auth/login'
                title='Login'
                className='border-b-2 border-transparent text-base font-semibold text-brand transition-colors duration-200 hover:border-brand focus:border-brand'
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href='/auth/signup'
                title='Sign Up'
                className='rounded-md border-2 border-transparent bg-brand px-8 py-3 text-base font-semibold text-secondaryBg transition-all duration-200 hover:border-brand hover:bg-transparent hover:text-brand focus:border-brand focus:bg-transparent focus:text-brand'
                role='button'
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* <!-- xs to lg --> */}
      <nav
        className={`${
          isMenuOpen ? 'sacle-100' : 'scale-0'
        } absolute w-[calc(100%-64px)] origin-top-right rounded-md border border-gray-200 bg-secondaryBg p-6 shadow-md transition-transform sm:w-[calc(100%-80px)] md:w-[calc(100%-96px)] lg:hidden`}
      >
        <div className='-my-2 flex flex-col space-y-1'>
          <Link
            href='/'
            title='Home'
            className='inline-flex py-3 text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href='/campgrounds'
            title='View Campgrounds'
            className='inline-flex py-3 text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
            onClick={() => setIsMenuOpen(false)}
          >
            Campgrounds
          </Link>

          {session && (
            <>
              <Link
                href={`/users/${session?.user?.id}`}
                title='Campgrounds'
                className='inline-flex py-3 text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href={`/users/${session?.user?.id}?tab=reviews`}
                title='Reviews'
                className='inline-flex py-3 text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href={`/users/${session?.user?.id}?tab=trips`}
                title='Your Trips'
                className='inline-flex py-3 text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
                onClick={() => setIsMenuOpen(false)}
              >
                Your Trips
              </Link>
            </>
          )}
          <Link
            href='/plus'
            title='Subscription'
            className='inline-flex py-3 text-base font-normal text-dark transition-all duration-200 hover:text-brand focus:text-brand'
            onClick={() => setIsMenuOpen(false)}
          >
            <span className='text-brand'>Tripmates Plus</span>
          </Link>
        </div>

        <div className='mt-8 flex items-center gap-6'>
          {session ? (
            <>
              <button
                title='Log out'
                className='border-b-2 border-transparent text-base font-semibold text-brand transition-all duration-200 hover:border-brand focus:border-brand'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign out
              </button>
              <Image
                src={session.user.image}
                alt={session.user.name}
                width='45'
                height='45'
                className='rounded-full border-2 border-brand'
              />
            </>
          ) : (
            <>
              <Link
                href='/auth/login'
                title='Login'
                className='border-b-2 border-transparent text-base font-semibold text-brand transition-all duration-200 hover:border-brand focus:border-brand'
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href='/auth/signup'
                title='Sign Up'
                className='rounded-md border-2 border-transparent bg-brand px-8 py-3 text-base font-semibold text-secondaryBg transition-all duration-200 hover:border-brand hover:bg-transparent hover:text-brand focus:border-brand focus:bg-transparent focus:text-brand'
                role='button'
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
