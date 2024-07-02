import { FaSpinner } from 'react-icons/fa'

const Button = ({
  title = '',
  text = 'Submit',
  danger = false,
  handleClick,
  disabled,
  className: styles,
}) => {
  const css = `rounded-md border-2 border-transparent bg-brand px-8 py-3 text-base font-semibold text-secondaryBg transition-all duration-200 ${styles}`

  return (
    <>
      {disabled ? (
        <button
          onClick={handleClick}
          title={title}
          className={`${css} flex cursor-not-allowed items-center justify-center gap-2`}
          disabled
        >
          <FaSpinner className='animate-spin' /> <span>Please wait</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          title={title}
          className={`${css} hover:border-brand hover:bg-transparent hover:text-brand focus:border-brand focus:bg-transparent focus:text-brand`}
        >
          {text}
        </button>
      )}
    </>
  )
}

export default Button
