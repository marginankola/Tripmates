import { useFormik } from 'formik'
import * as Yup from 'yup'
import { signIn } from 'next-auth/react'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Link from 'next/link'
import Image from 'next/image'
import illustration from '/public/illustrations/login.png'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Login = () => {
  const router = useRouter()

  useEffect(() => {
    router?.query?.error && toast.error(router.query.error)
  }, [])

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Please enter an email'),
      password: Yup.string()
        .min(8, 'Password length must be atleast 8')
        .required('Please enter the password'),
    }),
    onSubmit: async values => {
      const status = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: router.query.callBackUrl || '/',
      })

      if (!status.ok) return toast.error(status.error)

      toast.success('Login successfull!')
      router.push('/')
    },
  })

  return (
    <main className='mt-14 flex flex-1 items-center gap-16 lg:mt-20 xl:mt-28'>
      <Image
        src={illustration}
        className='hidden max-w-[50%] flex-1 self-center lg:block'
        alt='illustration'
      />
      <div className='mx-auto flex max-w-full flex-col gap-8 lg:mx-0 lg:flex-1'>
        <h2 className='text-center font-volkhov text-3xl font-bold md:gap-4 lg:text-4xl'>
          Login
        </h2>
        <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
          <Input
            type='email'
            name='email'
            placeholder='Email'
            onBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            value={formik.values.email}
            error={
              formik.touched.email &&
              formik.errors.email && [true, formik.errors.email]
            }
          />
          <Input
            type='password'
            name='password'
            placeholder='Enter Password'
            onBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            value={formik.values.password}
            error={
              formik.touched.password &&
              formik.errors.password && [true, formik.errors.password]
            }
          />
          <Button text='Login' title='Login' className='mx-auto mt-4 w-fit' />
        </form>
        <div className='flex items-center justify-between gap-4'>
          <hr className='flex-1' />
          or
          <hr className='flex-1' />
        </div>
        <div className='justify-betwee flex flex-col items-center gap-4 sm:flex-row'>
          <button
            className='flex w-full flex-1 items-center justify-center gap-2 rounded-md border-2 border-blue bg-blue px-4 py-3 text-primaryBg transition-colors hover:bg-transparent hover:text-blue'
            onClick={() =>
              signIn('google', { callbackUrl: router.query.callbackUrl || '/' })
            }
          >
            <FaGoogle />
            Google
          </button>
          <button
            className='flex w-full flex-1 items-center justify-center gap-2 rounded-md border-2 border-blue bg-blue px-4 py-3 text-primaryBg transition-colors hover:bg-transparent hover:text-blue'
            onClick={() =>
              signIn('facebook', {
                callbackUrl: router.query.callbackUrl || '/',
              })
            }
          >
            <FaFacebook />
            Facebook
          </button>
        </div>
        <p className='mx-auto'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/signup'
            className='text-brand hover:border-b hover:border-brand'
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Login
