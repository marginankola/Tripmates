import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'

export default function ComboBox({
  list,
  styles,
  selected,
  setSelected,
  listStyles = '-translate-y-full',
}) {
  const [query, setQuery] = useState('')

  const filteredList =
    query === ''
      ? list
      : list.filter(item =>
          item.text
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div>
      <Combobox value={selected} onChange={setSelected}>
        <div className='relative'>
          <div
            className={`relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 ${styles}`}
          >
            <Combobox.Input
              className='w-full border-none focus:ring-0'
              displayValue={item => item.text}
              onChange={event => setQuery(event.target.value)}
            />
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className={`absolute top-0 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${listStyles}`}
            >
              {filteredList.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                  Nothing found.
                </div>
              ) : (
                filteredList.map((item, i) => (
                  <Combobox.Option
                    key={item.text}
                    className={({ active }) =>
                      `relative cursor-default select-none p-2 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={item}
                    disabled={item.disable}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {item.text}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
