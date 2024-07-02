const ButtonOutline = ({
  title = '',
  text = 'Submit',
  handleClick,
  className: styles,
}) => {
  return (
    <button
      onClick={handleClick}
      title={title}
      className={`rounded-md border-2 border-brand bg-transparent px-6 py-3 text-sm font-semibold text-brand transition-transform duration-200 lg:px-8 lg:text-base ${styles} hover:scale-105 focus:scale-105`}
    >
      {text}
    </button>
  )
}

export default ButtonOutline
