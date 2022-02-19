import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import Input from '@/components/Input'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const { user } = useAuth({ middleware: 'guest' })
  const [link, setLink] = useState('')
  const router = useRouter()

  const handleSubmit = e => {
    e.preventDefault()
    router.push(`/search/${encodeURIComponent(link)}`)
  }
  return (
    <>
      <Head>
        <title>Laravel</title>
      </Head>

      <div className="relative flex items-top justify-center min-h-screen bg-green-50 dark:bg-gray-900 sm:items-center sm:pt-0">
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
          {user ? (
            <Link href="/dashboard">
              <a className="ml-4 text-sm text-gray-700 underline">Dashboard</a>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <a className="text-sm text-gray-700 underline">Login</a>
              </Link>

              <Link href="/register">
                <a className="ml-4 text-sm text-gray-700 underline">Register</a>
              </Link>
            </>
          )}
        </div>
        <main className="flex flex-col justify-center items-center space-y-20 p-4 text-gray-800">
          <h1 className=" text-5xl font-bold text-green-700">Verify</h1>
          <p className=" text-lg text-center">
            search the credibilty of links and if they are legit or not
          </p>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="" className=" text-xs mb-3 block">
              <b>note:</b> it must start with http:// or https://
            </label>
            <input
              className="border-2 border-gray-500 rounded-lg block  p-3 w-80 focus:ring-2 focus:ring-green-600"
              placeholder="paste the link.."
              value={link}
              onChange={e => setLink(e.target.value)}
              type="url"
            />
          </form>
        </main>
      </div>
    </>
  )
}
