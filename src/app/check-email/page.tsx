import Link from 'next/link'

const CheckEmail = () => {
  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <h1 className="text-sky-500">
        check your email for a magic link to login to the website.
      </h1>
      <p>
        if you use gmail, then you can use{' '}
        <a className="anchor" href="https://growth.design/sniper-link">
          a sniper link
        </a>{' '}
        to access it directly by{' '}
        <a
          className="anchor"
          href="https://mail.google.com/mail/u/0/#search/from%3A(%40resend.dev)+in%3Aanywhere"
        >
          clicking here 🪄
        </a>
      </p>
    </>
  )
}

export default CheckEmail
