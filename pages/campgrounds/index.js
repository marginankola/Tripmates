import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import CampgroundCard from '../../components/CampgroundCard'
// map stuff
import ReactMapGl, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  FaMapMarked,
  FaListUl,
  FaThumbtack,
  FaTimes,
  FaCheck,
} from 'react-icons/fa'
import Campground from '../../models/Campground'
import connectDB from '../../util/mongo'
import Review from '../../models/Review'
import User from '../../models/User'
import { IoOptions } from 'react-icons/io5'
import ComboBox from '../../components/ComboBox'
import { getNames } from 'country-list'
import { useRouter } from 'next/router'

const Campgrounds = ({
  campgrounds,
  filters = {
    location: '',
    price_min: '',
    price_max: '',
    plus_exclusive: false,
  },
  sortBy = '',
  numOfFilters,
}) => {
  const router = useRouter()

  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const [location, setLocation] = useState(filters.location)
  const [minPrice, setMinPrice] = useState(filters.price_min)
  const [maxPrice, setMaxPrice] = useState(filters.price_max)
  const [sort, setSort] = useState(sortBy)
  const [plusExclusive, setPlusExclusive] = useState(filters.plus_exclusive)

  const countries = getNames().map(country => ({
    text: country,
    disable: false,
  }))

  // Map over the campgrounds to create JSX
  const renderCampgrounds = campgrounds.map(campground => (
    <li key={campground._id}>
      <CampgroundCard campground={campground} />
    </li>
  ))

  const renderMarkers = campgrounds.map(campground => (
    <Marker
      key={campground._id}
      anchor='left'
      latitude={campground.location.coords.lat}
      longitude={campground.location.coords.long}
    >
      <CampMarker camp={campground} />
    </Marker>
  ))

  const [showMap, setShowMap] = useState(false)

  const handleFilterSubmit = () => {
    router.push(
      `/campgrounds?location=${
        !!location.text ? location.text : ''
      }&price_min=${minPrice}&price_max=${maxPrice}&sort=${sort}&plus_exclusive=${plusExclusive}`
    )
  }

  return (
    <>
      <Head>
        <title>Tripmates | All Campgrounds</title>
      </Head>
      <section className='relative py-12'>
        <div className='mb-10 flex items-center justify-between'>
          <h2 className='font-volkhov text-3xl'>Top Campgrounds</h2>
          <div className='relative md:hidden'>
            <button
              className='relative flex items-center gap-2 rounded-md border-2 border-dark p-2 '
              onClick={e => setShowFilterMenu(prev => !prev)}
            >
              <IoOptions />
              <span>Filters</span>
              {numOfFilters > 0 && (
                <span className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand p-1 text-primaryBg'>
                  {numOfFilters}
                </span>
              )}
            </button>
            {showFilterMenu && (
              <form
                className='absolute top-full right-0 z-10 mt-2 flex max-w-xs flex-col gap-3 rounded-lg bg-lightRed p-5'
                onSubmit={handleFilterSubmit}
              >
                <div>
                  <label htmlFor='location'>Location: </label>
                  <ComboBox
                    listStyles='right-0 '
                    list={[{ text: 'Select', disable: true }, ...countries]}
                    selected={location}
                    styles={'p-2'}
                    setSelected={setLocation}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <label htmlFor='min_price' className='flex-1'>
                    Min Price:{' '}
                  </label>
                  <input
                    type='number'
                    id='min_price'
                    onChange={e => setMinPrice(e.target.value)}
                    className='w-36 rounded-lg p-2'
                    value={minPrice}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <label htmlFor='max_price' className='flex-1'>
                    Max Price:{' '}
                  </label>
                  <input
                    type='number'
                    id='max_price'
                    onChange={e => setMaxPrice(e.target.value)}
                    className='w-36 rounded-lg p-2'
                    value={maxPrice}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <label htmlFor='sort' className='flex-1'>
                    Sort:{' '}
                  </label>
                  <select
                    id='sort'
                    className='rounded-lg bg-primaryBg p-2'
                    name='sort'
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                  >
                    <option value='' disabled selected={!sort}>
                      Select
                    </option>
                    <option
                      selected={sort === 'sort-rating-asc'}
                      value='sort-rating-asc'
                    >
                      Rating Asc
                    </option>
                    <option
                      selected={sort === 'sort-rating-desc'}
                      value='sort-rating-desc'
                    >
                      Rating Desc
                    </option>
                    <option
                      selected={sort === 'sort-price-asc'}
                      value='sort-price-asc'
                    >
                      Price Asc
                    </option>
                    <option
                      selected={sort === 'sort-price-desc'}
                      value='sort-price-desc'
                    >
                      Price Desc
                    </option>
                  </select>
                </div>
                <div className='flex items-center gap-1'>
                  <input
                    type='checkbox'
                    checked={plusExclusive}
                    id='plus_exclusive'
                    onChange={e => setPlusExclusive(e.target.checked)}
                  />
                  <label htmlFor='plus_exclusive'>
                    Tripmates Plus Exclusive
                  </label>
                </div>
                <div className='mt-2 flex items-center justify-between'>
                  <button
                    type='button'
                    className='flex items-center gap-1'
                    onClick={() => router.push('/campgrounds')}
                  >
                    <FaTimes />
                    Clear
                  </button>
                  <button type='submit' className='flex items-center gap-1'>
                    <FaCheck />
                    Apply
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className='hidden items-center gap-4 md:flex'>
            {showMap ? (
              <button
                className='flex items-center gap-2 rounded-md bg-blue p-2 text-white'
                onClick={() => setShowMap(false)}
              >
                <FaListUl />
                Show List
              </button>
            ) : (
              <button
                className='flex items-center gap-2 rounded-md bg-blue p-2 text-white'
                onClick={() => setShowMap(true)}
              >
                <FaMapMarked />
                Show Map
              </button>
            )}
            <div className='relative'>
              <button
                className='flex items-center gap-2 rounded-md border-2 border-dark p-2'
                onClick={e => setShowFilterMenu(prev => !prev)}
              >
                <IoOptions />
                <span>Filters</span>
                {numOfFilters > 0 && (
                  <span className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand p-1 text-primaryBg'>
                    {numOfFilters}
                  </span>
                )}
              </button>
              {showFilterMenu && (
                <form
                  className='absolute top-full right-0 z-10 mt-2 flex max-w-xs flex-col gap-3 rounded-lg bg-lightRed p-5'
                  onSubmit={handleFilterSubmit}
                >
                  <div>
                    <label htmlFor='location'>Location: </label>
                    <ComboBox
                      listStyles='right-0 '
                      list={[{ text: 'Select', disable: true }, ...countries]}
                      selected={location}
                      styles={'p-2'}
                      setSelected={setLocation}
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <label htmlFor='min_price' className='w-max'>
                      Min Price:{' '}
                    </label>
                    <input
                      type='number'
                      id='min_price'
                      onChange={e => setMinPrice(e.target.value)}
                      className='w-36 rounded-lg p-2'
                      min='0'
                      value={minPrice}
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <label htmlFor='max_price' className='w-max'>
                      Max Price:{' '}
                    </label>
                    <input
                      type='number'
                      id='max_price'
                      onChange={e => setMaxPrice(e.target.value)}
                      className='w-36 rounded-lg p-2'
                      min='0'
                      value={maxPrice}
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <label htmlFor='sort' className='flex-1'>
                      Sort:{' '}
                    </label>
                    <select
                      id='sort'
                      className='rounded-lg bg-primaryBg p-2'
                      name='sort'
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                    >
                      <option value='' disabled selected={!sort}>
                        Select
                      </option>
                      <option
                        selected={sort === 'sort-rating-asc'}
                        value='sort-rating-asc'
                      >
                        Rating Asc
                      </option>
                      <option
                        selected={sort === 'sort-rating-desc'}
                        value='sort-rating-desc'
                      >
                        Rating Desc
                      </option>
                      <option
                        selected={sort === 'sort-price-asc'}
                        value='sort-price-asc'
                      >
                        Price Asc
                      </option>
                      <option
                        selected={sort === 'sort-price-desc'}
                        value='sort-price-desc'
                      >
                        Price Desc
                      </option>
                    </select>
                  </div>
                  <div className='flex items-center gap-1'>
                    <input
                      type='checkbox'
                      checked={plusExclusive}
                      id='plus_exclusive'
                      onChange={e => setPlusExclusive(e.target.checked)}
                    />
                    <label htmlFor='plus_exclusive'>
                      Tripmates Plus Exclusive
                    </label>
                  </div>
                  <div className='mt-2 flex items-center justify-between'>
                    <button
                      type='button'
                      className='flex items-center gap-1'
                      onClick={() => router.push('/campgrounds')}
                    >
                      <FaTimes />
                      Clear
                    </button>
                    <button type='submit' className='flex items-center gap-1'>
                      <FaCheck />
                      Apply
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className='fixed bottom-8 right-8 z-40 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12 md:hidden'>
            {showMap ? (
              <button
                className='flex items-center gap-2 rounded-full bg-blue p-4 text-white'
                onClick={() => setShowMap(false)}
              >
                <FaListUl />
              </button>
            ) : (
              <button
                className='flex items-center gap-2 rounded-full bg-blue p-4 text-white'
                onClick={() => setShowMap(true)}
              >
                <FaMapMarked />
              </button>
            )}
          </div>
        </div>

        {!!campgrounds.length ? (
          showMap ? (
            <div className='sticky top-0 right-0 h-screen flex-[4] overflow-hidden rounded-xl lg:block'>
              <ReactMapGl
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_KEY}
                initialViewState={{
                  latitude: campgrounds[0].location.coords.lat,
                  longitude: campgrounds[0].location.coords.long,
                  zoom: 4,
                }}
                mapStyle='mapbox://styles/dharmik403/cleh3wthw003g01qgpq5gxlk7'
                attributionControl={false}
              >
                {renderMarkers}
                <GeolocateControl position='top-left' trackUserLocation />
              </ReactMapGl>
            </div>
          ) : (
            <ul className='grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {renderCampgrounds}
            </ul>
          )
        ) : (
          <p>No campgrounds are available for selected filter</p>
        )}
      </section>
    </>
  )
}

export async function getServerSideProps(context) {
  await connectDB()
  await Review.find({})
  await User.find({})

  const {
    location = null,
    price_min = null,
    price_max = null,
    sort = null,
    plus_exclusive = null,
  } = context.query

  // Fetch campground data
  const campgrounds = await Campground.find({})
  const camps = JSON.parse(JSON.stringify(campgrounds))

  if (!location && !price_min && !price_max && !sort && !plus_exclusive)
    return {
      props: { campgrounds: camps, location, numOfFilters: 0 },
    }

  let numOfFilters = 0
  let filteredCamps = camps

  if (location) {
    numOfFilters += 1
    filteredCamps = filteredCamps.filter(
      camp => camp.location.country === location
    )
  }

  if (price_min) {
    numOfFilters += 1
    filteredCamps = filteredCamps.filter(
      camp =>
        (camp.price.adults * (100 - camp.price.discount)) / 100 >=
        Number(price_min)
    )
  }

  if (price_max) {
    numOfFilters += 1
    filteredCamps = filteredCamps.filter(
      camp =>
        (camp.price.adults * (100 - camp.price.discount)) / 100 <=
        Number(price_max)
    )
  }

  if (sort) {
    numOfFilters += 1
    switch (sort) {
      case 'sort-rating-asc':
        filteredCamps = filteredCamps.sort(
          (a, b) => (a.rating || 0) - (b.rating || 0)
        )
        break
      case 'sort-rating-desc':
        filteredCamps = filteredCamps.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        )
        break
      case 'sort-price-asc':
        filteredCamps = filteredCamps.sort(
          (a, b) =>
            (a.price.adults * (100 - a.price.discount)) / 100 -
            (b.price.adults * (100 - b.price.discount)) / 100
        )
        break
      case 'sort-price-desc':
        filteredCamps = filteredCamps.sort(
          (a, b) =>
            (b.price.adults * (100 - b.price.discount)) / 100 -
            (a.price.adults * (100 - a.price.discount)) / 100
        )
        break
      default:
        break
    }
  }

  if (plus_exclusive === 'true') {
    numOfFilters += 1
    filteredCamps = filteredCamps.filter(camp => camp.plusExclusive)
  }

  return {
    props: {
      campgrounds: filteredCamps,
      filters: {
        location: { text: location },
        price_min,
        price_max,
        plus_exclusive,
      },
      sortBy: sort,
      numOfFilters,
    },
  }
}

const CampMarker = ({ camp }) => {
  return (
    <Link
      href={`/campgrounds/${camp._id}`}
      className='flex items-center text-brand'
    >
      <FaThumbtack size={20} className='-rotate-45' />
      <p className='rounded-md bg-secondaryBg p-1'>{camp.name}</p>
    </Link>
  )
}

export default Campgrounds
