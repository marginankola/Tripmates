import { useState } from 'react'
import { HiStar, HiOutlineStar } from 'react-icons/hi2'

const ReviewForm = ({ setShowForm, camps, handleSubmit }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedOption, setSelectedOption] = useState(0)
  const [rating, setRating] = useState(0)

  const selectOption = i => {
    setSelectedOption(i)
    setShowMenu(false)
  }

  const renderStars = () => {
    const selectedStars = Array.from({ length: rating }).map((_, i) => (
      <HiStar
        key={i}
        onClick={() => setRating(i + 1)}
        className='cursor-pointer text-lg text-brand'
      />
    ))
    const outlineStars = Array.from({ length: 5 - rating }).map((_, i) => (
      <HiOutlineStar
        key={i + rating}
        onClick={() => setRating(i + 1 + rating)}
        className='cursor-pointer text-lg text-brand'
      />
    ))

    return [...selectedStars, ...outlineStars]
  }

  const renderCampOptions = () =>
    camps.map((camp, i) => (
      <li
        className={`relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-brand hover:text-white ${
          selectedOption === i && 'bg-brand text-white'
        }`}
        id='listbox-option-0'
        role='option'
        key={camp._id}
        onClick={() => selectOption(i)}
      >
        <div className='flex items-center'>
          <span
            className={`ml-3 block truncate font-normal ${
              selectedOption === i && 'font-semibold'
            }`}
          >
            {camp.name}
          </span>
        </div>
      </li>
    ))

  return (
    <div
      className='relative z-50'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      {/* <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  --> */}
      <div className='fixed inset-0 bg-paragraph bg-opacity-75 transition-opacity'></div>

      <div className='fixed inset-0 z-10 overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          {/* <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      --> */}
          <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
            <form
              className='flex max-w-xl flex-col gap-5 rounded-lg p-8'
              onSubmit={e => handleSubmit(e, camps[selectedOption]._id, rating)}
            >
              <div>
                <label
                  id='listbox-label'
                  className='block text-sm font-medium text-gray-700'
                >
                  Campground
                </label>
                <div className='relative mt-1'>
                  <button
                    type='button'
                    className='relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
                    aria-haspopup='listbox'
                    aria-expanded='true'
                    aria-labelledby='listbox-label'
                    onClick={() => setShowMenu(curr => !curr)}
                  >
                    <span className='flex items-center'>
                      <span className='ml-3 block truncate'>
                        {camps[selectedOption].name}
                      </span>
                    </span>
                    <span className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
                      <svg
                        className='h-5 w-5 text-gray-400'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  </button>

                  {showMenu && (
                    <ul
                      className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
                      tabIndex='-1'
                      role='listbox'
                      aria-labelledby='listbox-label'
                      aria-activedescendant='listbox-option-3'
                    >
                      {renderCampOptions()}
                    </ul>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label id='listbox-label'>Rating</label>
                <div className='flex gap-2'>{renderStars()}</div>
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='text'>Review</label>
                <textarea
                  name='text'
                  id='text'
                  rows='5'
                  className='max-w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
                />
              </div>
              <div>
                <button
                  className='mr-3 rounded-lg bg-brand p-3 text-white'
                  type='submit'
                >
                  Submit
                </button>
                <button
                  className='rounded-lg bg-red p-3 text-white'
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewForm
