import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Import Volkov and Poppins fonts from google fonts */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Volkhov:wght@700&display=swap'
          rel='stylesheet'
        />
        <link
          rel='icon'
          href='/favicon.ico'
          media='(prefers-color-scheme: light)'
        />
        <link
          rel='icon'
          href='/favicon-dark.ico'
          media='(prefers-color-scheme: dark)'
        />
        {/* <!-- Primary Meta Tags --> */}
        <meta name='title' content='YelpCamp | Campgrounds' />
        <meta
          name='description'
          content='With YelpCamp you can find trustworthy reviews for campgrounds around the world!'
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://yelpcamp2.vercel.app' />
        <meta property='og:title' content='YelpCamp | Campgrounds' />
        <meta
          property='og:description'
          content='With YelpCamp you can find trustworthy reviews for campgrounds around the world!'
        />
        <meta
          property='og:image'
          content='https://yelpcamp2.vercel.app/home.png'
        />

        {/* <!-- Twitter --> */}
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content='https://yelpcamp2.vercel.app' />
        <meta property='twitter:title' content='YelpCamp | Campgrounds' />
        <meta
          property='twitter:description'
          content='With YelpCamp you can find trustworthy reviews for campgrounds around the world!'
        />
        <meta
          property='twitter:image'
          content='https://yelpcamp2.vercel.app/home.png'
        />
      </Head>
      <body className='bg-primaryBg'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
