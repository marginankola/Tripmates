import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FaRupeeSign, FaExclamationCircle } from 'react-icons/fa'
import { IoClose, IoAdd } from 'react-icons/io5'
import Button from './Button'
import Input from './Input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { v4 } from 'uuid'
import ReactMapGl, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Geocoder from './Geocoder'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaSpinner } from 'react-icons/fa'
import Link from 'next/link'

const Form = ({ submitForm, data, disabled, subscribed }) => {
  const amenitiesList = [
    { text: 'restrooms', icon: 'FaRestroom' },
    { text: 'water supply', icon: 'FaFaucet' },
    { text: 'trash cans', icon: 'FaRecycle' },
    { text: 'general store', icon: 'FaStore' },
    { text: 'firewood', icon: 'GiCampfire' },
    { text: 'laundry', icon: 'GiWashingMachine' },
    { text: 'beach', icon: 'FaUmbrellaBeach' },
    { text: 'swimming pool', icon: 'FaSwimmingPool' },
    { text: 'hiking trails', icon: 'FaHiking' },
    { text: 'sports courts', icon: 'FaBasketballBall' },
    { text: 'pet friendly', icon: 'FaDog' },
    { text: 'wifi', icon: 'FaWifi' },
    { text: 'tent rentals', icon: 'FaCampground' },
    { text: 'rock climbing', icon: 'GiMountainClimbing' },
    { text: 'wildlife viewing', icon: 'GiFlamingo' },
    { text: 'stargazing', icon: 'HiStar' },
    { text: 'yoga', icon: 'GiMeditation' },
  ]

  const [amenitiesInputValue, setAmenetiesInputValue] = useState('')
  const [showAmenetiesList, setShowAmenetiesList] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: data?.name || '',
      desc: data?.desc || '',
      adultPrice: data?.price.adults || '',
      childrenPrice: data?.price.children || '',
      images: data?.images || [],
      city: data?.location.city || '',
      state: data?.location.state || '',
      country: data?.location.country || '',
      amenities: data?.amenities || [],
      terms: !!data?.name || false,
      plusExclusive: data?.plusExclusive || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please enter a name!'),
      desc: Yup.string()
        .max(750, 'Description cannot be more than 750')
        .required('Please enter a description!'),
      images: Yup.array().min(1, 'Please select atleast 1 image!').required(),
      adultPrice: Yup.number()
        .min(0, 'Price cannot be less than 0!')
        .required('Please enter a price!'),
      childrenPrice: Yup.number()
        .min(0, 'Price cannot be less than 0!')
        .required('Please enter a price!'),
      city: Yup.string().required('Please enter the city!'),
      state: Yup.string().required('Please enter the state!'),
      country: Yup.string().required('Please enter the country!'),
      amenities: Yup.array()
        .min(1, 'Please select atleast 1 amenity')
        .required(),
      terms: Yup.boolean().oneOf(
        [true],
        'You must agree to terms and conditions to continue'
      ),
      plusExclusive: Yup.boolean().oneOf([true, false]),
    }),
    onSubmit: values => {
      submitForm({
        ...values,
        location: {
          coords,
          city: values.city,
          state: values.state,
          country: values.country,
        },
        price: {
          adults: values.adultPrice,
          children: values.childrenPrice,
          discount: 0,
        },
      })
    },
  })

  const amenityRef = useRef()

  const [isImageDragged, setIsImageDragged] = useState(false)
  const [coords, setCoords] = useState(data?.location.coords || {})

  useEffect(() => {
    if (Object.keys(coords).length > 1) return
    getCoords()
  }, [])

  useEffect(() => {
    if (Object.keys(coords).length === 0) return

    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${coords.lat}&lon=${coords.long}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`

    axios
      .get(url)
      .then(response => {
        const { city, state, country } = response.data.features[0].properties
        formik.setFieldValue('city', city || '')
        formik.setFieldValue('state', state || '')
        formik.setFieldValue('country', country || '')
      })
      .catch(err => console.log(err))
  }, [coords])

  const getCoords = () => {
    navigator.geolocation.getCurrentPosition(
      // Success function
      showPosition,
      // Error function
      e => {
        if (e.code !== e.PERMISSION_DENIED) return
        setCoords({ lat: 21.17, long: 72.83 })
        toast.warn('Please allow location permission')
      },
      // Options.
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }

  const showPosition = pos => {
    setCoords({
      lat: pos.coords.latitude,
      long: pos.coords.longitude,
    })
  }

  const handleImageUpload = async e => {
    if (!e.target.files[0]) return

    const files = Array.from(e.target.files)

    const imgs = files.map(file => ({
      id: v4(),
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    formik.setFieldValue('images', [...formik.values.images, ...imgs])
  }

  const removePreviewImage = img => {
    formik.setFieldValue(
      'images',
      formik.values.images.filter(imgFile => imgFile.id != img.id)
    )
  }

  const renderPreviewImgs = () => {
    if (formik.values.images.length <= 0) return

    return formik.values.images.map(img => (
      <div className='group relative w-full rounded-xl pb-5' key={img.id}>
        <Image
          src={img.url || img.previewUrl}
          width='350'
          height='350'
          className='w-full rounded-xl'
          alt={img.file?.name || ''}
        ></Image>
        <IoClose
          role='button'
          title='Remove Image'
          className='absolute top-5 right-5 cursor-pointer rounded-full bg-lightBlue p-[2px] text-2xl transition-transform lg:scale-0 lg:group-hover:scale-100'
          onClick={() => removePreviewImage(img)}
        />
      </div>
    ))
  }

  useEffect(() => {
    const handle = e => {
      if (amenityRef.current.contains(e.target) && !!amenitiesInputValue) {
        setShowAmenetiesList(true)
      } else {
        setShowAmenetiesList(false)
      }
    }

    window.addEventListener('mousedown', handle)
    return () => window.removeEventListener('mousedown', handle)
  })

  return (
    <form
      className='x-auto flex w-full flex-col gap-10 lg:mx-0'
      onSubmit={formik.handleSubmit}
    >
      <div className='flex flex-col gap-4'>
        <h3 className='font-volkhov text-2xl lg:text-3xl'>
          Write Name and Description
        </h3>
        <Input
          type='text'
          name='name'
          placeholder='Enter the name'
          handleChange={formik.handleChange}
          value={formik.values.name}
          className={`${
            !!formik.touched.name &&
            !!formik.errors.name &&
            'outline outline-2 outline-red'
          }`}
          onBlur={formik.handleBlur}
        />
        {!!formik.touched.name && !!formik.errors.name && (
          <span className='inline-flex items-center gap-2 text-sm text-red'>
            <FaExclamationCircle />
            {formik.errors.name}
          </span>
        )}
        <Input
          type='textarea'
          name='desc'
          rows='10'
          placeholder='Enter the description'
          handleChange={formik.handleChange}
          value={formik.values.desc}
          className={`${
            !!formik.touched.desc &&
            !!formik.errors.desc &&
            'outline outline-2 outline-red'
          }`}
          onBlur={formik.handleBlur}
        />
        {!!formik.touched.desc && !!formik.errors.desc && (
          <span className='inline-flex items-center gap-2 text-sm text-red'>
            <FaExclamationCircle />
            {formik.errors.desc}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='font-volkhov text-2xl lg:text-3xl'>
          Select the Location
        </h3>
        <div className='h-72 overflow-hidden rounded-xl lg:h-96'>
          {!(Object.keys(coords).length === 0) ? (
            <ReactMapGl
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_KEY}
              initialViewState={{
                latitude: coords.lat,
                longitude: coords.long,
                zoom: 8,
              }}
              mapStyle='mapbox://styles/mapbox/streets-v9'
              attributionControl={false}
              onClick={e =>
                setCoords({ lat: e.lngLat.lat, long: e.lngLat.lng })
              }
            >
              <Marker
                latitude={coords.lat}
                longitude={coords.long}
                draggable
                onDragEnd={e =>
                  setCoords({ lat: e.lngLat.lat, long: e.lngLat.lng })
                }
              />
              <GeolocateControl position='top-left' trackUserLocation />
              <Geocoder setLocation={setCoords} />
            </ReactMapGl>
          ) : (
            <FaSpinner className='animate-spin' />
          )}
        </div>
        <div className='md:columns-2 lg:columns-3'>
          <div className='flex flex-col gap-4'>
            <Input
              name='city'
              placeholder='Enter City'
              handleChange={formik.handleChange}
              value={formik.values.city}
              onBlur={formik.handleBlur}
              className={`${
                !!formik.touched.city &&
                !!formik.errors.city &&
                'outline outline-2 outline-red'
              }`}
            />
            {!!formik.touched.city && !!formik.errors.city && (
              <span className='inline-flex items-center gap-2 text-sm text-red'>
                <FaExclamationCircle />
                {formik.errors.city}
              </span>
            )}
          </div>
          <div className='my-4 flex flex-col gap-4'>
            <Input
              name='state'
              placeholder='Enter State'
              handleChange={formik.handleChange}
              value={formik.values.state}
              onBlur={formik.handleBlur}
              className={`${
                !!formik.touched.state &&
                !!formik.errors.state &&
                'outline outline-2 outline-red'
              }`}
            />
            {!!formik.touched.state && !!formik.errors.state && (
              <span className='inline-flex items-center gap-2 text-sm text-red'>
                <FaExclamationCircle />
                {formik.errors.state}
              </span>
            )}
          </div>
          <div className='flex flex-col gap-4'>
            <Input
              name='country'
              placeholder='Enter Country'
              handleChange={formik.handleChange}
              value={formik.values.country}
              onBlur={formik.handleBlur}
              className={`${
                !!formik.touched.country &&
                !!formik.errors.country &&
                'outline outline-2 outline-red'
              }`}
            />
            {!!formik.touched.country && !!formik.errors.country && (
              <span className='inline-flex items-center gap-2 text-sm text-red'>
                <FaExclamationCircle />
                {formik.errors.country}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='font-volkhov text-2xl lg:text-3xl'>Add some photos</h3>
        <div className='rounded-xl bg-lightBlue'>
          <label
            htmlFor='image'
            className={`relative flex w-full cursor-pointer justify-between rounded-xl bg-lightBlue p-5 text-dark outline-2 focus-within:outline focus-within:outline-brand ${
              !!isImageDragged && 'italic outline-dashed outline-brand'
            } ${
              !!formik.touched.images &&
              !!formik.errors.images &&
              'outline outline-2 outline-red'
            }`}
            onDragEnter={() => setIsImageDragged(true)}
            onDragExit={() => setIsImageDragged(false)}
            onDrop={() => setIsImageDragged(false)}
          >
            {isImageDragged ? 'Drop here' : 'Choose or Drag images'}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-tabler icon-tabler-photo-plus text-dark'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              strokeWidth='2'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
              <path d='M15 8h.01'></path>
              <path d='M12 20h-5a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5'></path>
              <path d='M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4'></path>
              <path d='M14 14l1 -1c.617 -.593 1.328 -.793 2.009 -.598'></path>
              <path d='M16 19h6'></path>
              <path d='M19 16v6'></path>
            </svg>
            <input
              id='image'
              type='file'
              name='name'
              placeholder='Upload an image'
              className='absolute top-0 left-0 h-full w-full cursor-pointer rounded-xl opacity-0'
              multiple
              onChange={handleImageUpload}
            />
          </label>
          <div
            className={`${
              !!(formik.values.images.length > 0) && 'px-5 pt-5'
            } gap-5 md:columns-2`}
          >
            {renderPreviewImgs()}
          </div>
        </div>
        {formik.touched.images && !!formik.errors.images && (
          <span className='inline-flex items-center gap-2 text-sm text-red'>
            <FaExclamationCircle />
            {formik.errors.images}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='font-volkhov text-2xl lg:text-3xl'>Select Amenities</h3>
        <div className='relative rounded-xl bg-lightBlue' ref={amenityRef}>
          <input
            type='text'
            value={amenitiesInputValue}
            placeholder='Type to search amenities'
            className={`w-full rounded-xl bg-lightBlue p-5 focus:outline focus:outline-2 focus:outline-brand`}
            onChange={e => {
              setAmenetiesInputValue(e.target.value)
              e.target.value.length > 0
                ? setShowAmenetiesList(true)
                : setShowAmenetiesList(false)
            }}
            onFocus={() => !!amenitiesInputValue && setShowAmenetiesList(true)}
          />
          {showAmenetiesList && (
            <ul className='flex flex-col gap-2 rounded-b-xl p-5'>
              {amenitiesList
                .filter(
                  amenity =>
                    amenity.text.includes(
                      amenitiesInputValue.toLocaleLowerCase()
                    ) &&
                    !formik.values.amenities.filter(
                      a => a.text === amenity.text
                    ).length
                )
                .map(amenity => (
                  <li
                    key={amenity.text}
                    className='cursor-pointer capitalize underline-offset-2 hover:underline'
                    onClick={() => {
                      setShowAmenetiesList(false)
                      setAmenetiesInputValue('')
                      formik.setFieldValue('amenities', [
                        ...formik.values.amenities,
                        amenity,
                      ])
                    }}
                  >
                    {amenity.text}
                  </li>
                ))}
            </ul>
          )}
          {!!formik.values.amenities.length && (
            <ul className='flex flex-wrap gap-5 p-5 capitalize'>
              {formik.values.amenities.map(amenity => (
                <li
                  key={amenity.text}
                  className='inline-flex items-center gap-2 rounded-xl border-2 border-brand p-5'
                >
                  {amenity.text}
                  <IoClose
                    className='cursor-pointer'
                    onClick={() =>
                      formik.setFieldValue(
                        'amenities',
                        formik.values.amenities.filter(
                          a => a.text !== amenity.text
                        )
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='font-volkhov text-2xl lg:text-3xl'>Enter the price</h3>
        <div className='flex gap-4'>
          <div className='flex flex-1 flex-col gap-4'>
            <div
              className={`flex max-w-full flex-1 items-center rounded-xl bg-lightBlue pl-5 focus-within:outline focus-within:outline-2 focus-within:outline-brand ${
                !!formik.touched.adultPrice &&
                !!formik.errors.adultPrice &&
                'outline outline-2 outline-red'
              }`}
            >
              <FaRupeeSign className='text-dark' />
              <Input
                type='number'
                name='adultPrice'
                placeholder='Adults Age 13+'
                className='w-full focus:!outline-0'
                handleChange={formik.handleChange}
                value={formik.values.adultPrice}
                onBlur={formik.handleBlur}
              />
            </div>
            {!!formik.touched.adultPrice && !!formik.errors.adultPrice && (
              <span className='inline-flex items-center gap-2 text-sm text-red'>
                <FaExclamationCircle />
                {formik.errors.adultPrice}
              </span>
            )}
          </div>
          <div className='flex flex-1 flex-col gap-4'>
            <div
              className={`flex max-w-full items-center rounded-xl bg-lightBlue pl-5 focus-within:outline focus-within:outline-2 focus-within:outline-brand ${
                !!formik.touched.childrenPrice &&
                !!formik.errors.childrenPrice &&
                'outline outline-2 outline-red'
              }`}
            >
              <FaRupeeSign className='text-dark' />
              <Input
                type='number'
                name='childrenPrice'
                placeholder='Children Age 2-12'
                className='w-full focus:!outline-0'
                handleChange={formik.handleChange}
                value={formik.values.childrenPrice}
                onBlur={formik.handleBlur}
              />
            </div>
            {!!formik.touched.childrenPrice && !!formik.errors.childrenPrice && (
              <span className='inline-flex items-center gap-2 text-sm text-red'>
                <FaExclamationCircle />
                {formik.errors.childrenPrice}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <div>
          <input
            type='checkbox'
            id='terms'
            className='mr-2 cursor-pointer'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.terms}
          />
          <label htmlFor='terms' className='cursor-pointer'>
            Agree to the{' '}
            <Link
              href={'/campgrounds/terms-and-conditions'}
              className='text-brand'
            >
              Terms and Conditions
            </Link>
          </label>
        </div>
        {!!formik.touched.terms && !!formik.errors.terms && (
          <span className='inline-flex items-center gap-2 text-sm text-red'>
            <FaExclamationCircle />
            {formik.errors.terms}
          </span>
        )}
      </div>
      {subscribed && (
        <div className='flex flex-col gap-4'>
          <div>
            <input
              type='checkbox'
              id='plusExclusive'
              className='mr-2 cursor-pointer'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.plusExclusive}
            />
            <label htmlFor='plusExclusive' className='cursor-pointer'>
              Keep this campground <span>Tripmates Plus</span> exclusive?
            </label>
          </div>
          {!!formik.touched.plusExclusive && !!formik.errors.plusExclusive && (
            <span className='inline-flex items-center gap-2 text-sm text-red'>
              <FaExclamationCircle />
              {formik.errors.plusExclusive}
            </span>
          )}
        </div>
      )}
      {<Button text='Submit' title='Add Campground' disabled={disabled} />}
    </form>
  )
}

export default Form
