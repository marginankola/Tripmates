import { useFormik } from 'formik'
import Input from '../../components/Input'
import * as Yup from 'yup'
import { signIn } from 'next-auth/react'
import Button from '../../components/Button'
import Image from 'next/image'
import illustration from '/public/illustrations/signup.svg'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const SignUp = () => {
  const router = useRouter()

  const submitForm = async values => {
    try {
      const user = await axios.post('/api/signup', values)
      toast.success('Registration successfull')
      router.push('/auth/login')
    } catch (e) {
      toast.error(e.response.data.message || 'Something went wrong')
    }
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please enter a username'),
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Please enter an email'),
      password: Yup.string()
        .min(8, 'Password length must be atleast 8')
        .required('Please enter the password'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match!')
        .required('Please enter the confirm password'),
    }),
    onSubmit: values => submitForm(values),
  })

  return (
    <main className='mt-14 flex flex-1 items-center gap-16  lg:mt-20 xl:mt-28'>
      <div className='mx-auto flex max-w-full flex-col gap-8 lg:mx-0 lg:flex-1'>
        <h2 className='text-center font-volkhov text-3xl font-bold md:gap-4 lg:text-4xl'>
          Sign Up
        </h2>
        <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
          <Input
            type='text'
            name='username'
            placeholder='Username'
            onBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            value={formik.values.username}
            error={
              formik.touched.username &&
              formik.errors.username && [true, formik.errors.username]
            }
          />
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
          <Input
            type='password'
            name='confirmPassword'
            placeholder='Enter Confirm Password'
            onBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            value={formik.values.confirmPassword}
            error={
              formik.touched.confirmPassword &&
              formik.errors.confirmPassword && [
                true,
                formik.errors.confirmPassword,
              ]
            }
          />
          <Button
            text='Sign Up'
            title='sign up'
            className='mx-auto mt-4 w-fit'
          />
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
              signIn('google', { callbackUrl: router.query.callBackUrl || '/' })
            }
          >
            <FaGoogle />
            Google
          </button>
          <button
            className='flex w-full flex-1 items-center justify-center gap-2 rounded-md border-2 border-blue bg-blue px-4 py-3 text-primaryBg transition-colors hover:bg-transparent hover:text-blue'
            onClick={() =>
              signIn('facebook', {
                callbackUrl: router.query.callBackUrl || '/',
              })
            }
          >
            <FaFacebook />
            Facebook
          </button>
        </div>
        <p className='mx-auto'>
          Already have an account?{' '}
          <Link
            href='/auth/login'
            className='text-brand hover:border-b hover:border-brand'
          >
            Log In
          </Link>
        </p>
      </div>
      <Image
        src={illustration}
        className='hidden max-w-[50%] flex-1 self-center lg:block'
        alt='illustration'
      />
    </main>
  )
}

export default SignUp
