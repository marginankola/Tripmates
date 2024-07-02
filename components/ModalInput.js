import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoWarningOutline } from 'react-icons/io5'
import { TbDiscount2 } from 'react-icons/tb'
import { useFormik } from 'formik'
import { FaExclamationCircle } from 'react-icons/fa'
import * as Yup from 'yup'

export default function ModalInput({
  open,
  setOpen,
  title,
  text,
  handleSubmit,
  defaultValue = '',
}) {
  const formik = useFormik({
    initialValues: {
      discount: defaultValue,
    },
    validationSchema: Yup.object({
      discount: Yup.number()
        .typeError('Must be a number')
        .max(35, 'You cannot add more discount than 35%')
        .min(0, 'Cannot be less than 0')
        .required('Please enter a value'),
    }),
    onSubmit: values => {
      handleSubmit(values)
      setOpen(false)
    },
  })

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-[9999999999] overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='bg-red-100 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10'>
                      <IoWarningOutline
                        className='text-red-600 h-6 w-6'
                        aria-hidden='true'
                      />
                    </div>
                    <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                      <Dialog.Title
                        as='h3'
                        className='text-base font-semibold leading-6 text-gray-900 lg:text-lg'
                      >
                        {title}
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500 lg:text-base'>
                          {text}
                        </p>
                      </div>
                      <div className='mt-4 flex w-max items-center rounded-md bg-lightBlue p-3 text-lg'>
                        <TbDiscount2 />
                        <input
                          type='text'
                          className='ml-3 bg-transparent font-poppins focus:outline-none '
                          name='discount'
                          value={formik.values.discount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {!!formik.touched.discount && !!formik.errors.discount && (
                        <span className='mt-2 inline-flex items-center gap-2 text-sm text-red'>
                          <FaExclamationCircle />
                          {formik.errors.discount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='submit'
                    className='inline-flex w-full justify-center rounded-md bg-red px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red sm:ml-3 sm:w-auto'
                    onClick={formik.handleSubmit}
                  >
                    Confirm
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
