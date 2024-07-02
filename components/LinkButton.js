import Link from 'next/link'

const LinkButton = ({ text, linkTo, className: styles }) => {
  return (
    <Link
      href={linkTo}
      className={`rounded-md border-2 border-transparent bg-brand px-8 py-3 text-base font-semibold text-secondaryBg transition-all duration-200 hover:border-brand hover:bg-transparent hover:text-brand focus:border-brand focus:bg-transparent focus:text-brand ${styles}`}
    >
      {text}
    </Link>
  )
}

export default LinkButton
