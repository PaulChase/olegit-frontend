import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import Input from '@/components/Input'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const { user } = useAuth({ middleware: 'guest' })
  const [link, setLink] = useState('')
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = e => {
    e.preventDefault()
    setIsPending(true)
    router.push(`/search/${encodeURIComponent(link)}`)
  }
  return (
    <>
      <Head>
        <title>O'Legit | verify the legitimacy of websites</title>
      </Head>

      <div className="relative flex items-top justify-center min-h-screen bg-gray-50 dark:bg-gray-900 sm:items-center sm:pt-0 font-sans">
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block"></div>
        <main className="flex flex-col justify-center items-center space-y-20 p-4 text-gray-800">
          <div>
            <h1 className=" text-5xl lg:text-7xl font-extrabold text-blue-700 mb-16 text-center uppercase">
              o'legit
            </h1>
            <p className=" text-lg lg:text-2xl text-center mb-10 font-medium">
              Verify the legitimacy of referral, crypto or survey websites.{' '}
              <br />{' '}
              <small>
                Just paste the link and see what others are saying about the
                website
              </small>
            </p>
            <form action="" onSubmit={handleSubmit}>
              <label htmlFor="" className=" text-xs mb-3 block lg:text-sm">
                <b>note:</b> it must start with http:// or https://
              </label>
              <input
                className="border-2 border-gray-500 rounded-lg block  p-3 w-full focus:ring-2  "
                placeholder="paste the link.."
                value={link}
                onChange={e => setLink(e.target.value)}
                type="url"
              />
              {isPending ? (
                <button
                  type="submit"
                  className=" bg-blue-400 w-full rounded-md uppercase p-2 font-bold text-white mt-4 hover:bg-blue-600">
                  searching ...
                </button>
              ) : (
                <button
                  type="submit"
                  className=" bg-blue-600 w-full rounded-md uppercase p-2 font-bold text-white mt-4 hover:bg-blue-800">
                  Verify Link
                </button>
              )}
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
