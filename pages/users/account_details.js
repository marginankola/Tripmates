import { useFormik } from 'formik'
import * as Yup from 'yup'
import valid from 'card-validator'
import { FaExclamationCircle } from 'react-icons/fa'
import Button from '../../components/Button'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const AccountDetails = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      acc_no: '',
      ifsc_no: '',
      acc_holder_name: '',
    },
    validationSchema: Yup.object({
      acc_no: Yup.number()
        .test(
          'test-number',
          'Invalid card number',
          value => valid.number(value).isValid
        )
        .required('Please enter card number'),
      ifsc_no: Yup.string()
        .length(11, 'Invalid IFSC number')
        .required('Please enter IFSC number'),
      acc_holder_name: Yup.string().required('Please enter card holder name'),
    }),
    onSubmit: async values => {
      setLoading(true)
      const res = await axios.post('/api/card-details', {
        ...values,
        user: session.user.id,
      })

      if (!res) return toast.error('Somethings went wrong!')

      setLoading(false)
      router.push(`/users/${session.user.id}?tab=earnings`)
      toast.success('Card details successfully saved')
    },
  })

  return (
    <div className='my-10 flex flex-col gap-4'>
      <h3 className='font-volkhov text-2xl lg:text-3xl'>
        Enter the card details
      </h3>
      <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
        <input
          type='text'
          name='acc_no'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.acc_no}
          placeholder='Enter Card Number'
          className={`w-full rounded-xl bg-lightBlue p-5 focus:outline focus:outline-2 focus:outline-brand ${
            !!formik.touched.acc_no &&
            !!formik.errors.acc_no &&
            'outline outline-2 outline-red'
          }`}
        />
        {!!formik.touched.acc_no && !!formik.errors.acc_no && (
          <span className='inline-flex items-center gap-2 text-sm text-red'>
            <FaExclamationCircle />
            {formik.errors.acc_no}
          </span>
        )}
        <input
          type='text'
          name='ifsc_no'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ifsc_no}
          placeholder='Enter IFSC Number'
          className={`w-full rounded-xl bg-lightBlue p-5 focus:outline focus:outline-2 focus:outline-brand ${
            !!formik.touched.ifsc_no &&
            !!formik.errors.ifsc_no &&
            'outline outline-2 outline-red'
          }`}
        />
        {!!formik.touched.ifsc_no && !!formik.errors.ifsc_no && (
          <span className='inline-flex items-center gap-2 text-sm text-red'>
            <FaExclamationCircle />
            {formik.errors.ifsc_no}
          </span>
        )}
        <input
          type='text'
          name='acc_holder_name'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.acc_holder_name}
          placeholder='Enter Card Holder Name'
          className={`w-full rounded-xl bg-lightBlue p-5 focus:outline focus:outline-2 focus:outline-brand ${
            !!formik.touched.acc_holder_name &&
            !!formik.errors.acc_holder_name &&
            'outline outline-2 outline-red'
          }`}
        />
        {!!formik.touched.acc_holder_name && !!formik.errors.acc_holder_name && (
          <span className='inline-flex items-center gap-2 text-sm text-red'>
            <FaExclamationCircle />
            {formik.errors.acc_holder_name}
          </span>
        )}
        {<Button text='Submit' title='Add Campground' disabled={loading} />}
      </form>
    </div>
  )
}

export default AccountDetails
