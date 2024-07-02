import { FaExclamationCircle } from 'react-icons/fa'

const Input = ({
  type = 'text',
  name = 'input',
  placeholder = 'Enter',
  className: styles,
  handleChange,
  value,
  error,
  onBlur,
}) => {
  const [isError, errorMsg] = error || []

  const css = `rounded-xl bg-lightBlue p-5 focus:outline focus:outline-2 focus:outline-brand ${styles} ${
    isError && 'outline outline-2 outline-red'
  }`

  return (
    <div className='flex w-full flex-col gap-2'>
      {type === 'textarea' ? (
        <textarea
          name={name}
          rows='10'
          placeholder={placeholder}
          className={css}
          onChange={handleChange}
          value={value}
          onBlur={onBlur}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={css}
          onChange={handleChange}
          value={value}
          onBlur={onBlur}
        />
      )}
      {isError && (
        <span className='inline-flex items-center gap-2 text-sm text-red'>
          <FaExclamationCircle />
          {errorMsg}
        </span>
      )}
    </div>
  )
}

export default Input
