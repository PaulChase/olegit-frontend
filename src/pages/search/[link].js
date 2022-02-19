import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import Input from '@/components/Input'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

export async function getServerSideProps(context) {
  // Fetch data from external API
  const res = await axios.get(`/api/links?link=${context.params.link}`)
  // const data = await res.json()
  const data = res.data
  // Pass data to the page via props
  return { props: { data } }
}

export default function LinkPage({ data }) {
  // const { user } = useAuth({ middleware: 'guest' })
  const router = useRouter()
  const { link } = router.query // get the link param from URL
  const [url, setUrl] = useState(link)
  const [website, setWebsite] = useState(data)

  // get the data of the new website that was submitted
  const getWebsite = async e => {
    e.preventDefault()
    const res = await axios.get(`/api/links?link=${url}`)
    // const data = await res.json()
    const data = res.data

    setWebsite(data)
  }

  return (
    <>
      <Head>
        <title>search page</title>
      </Head>

      <main className="">
        <nav className=" mb-4 border-b-2 border-green-400 p-3">
          <Link href="/">
            <a className="text-3xl font-bold text-green-700">Verify</a>
          </Link>

          <form action="" onSubmit={getWebsite}>
            <label htmlFor="" className=" text-xs mb-3 block">
              <b>note:</b> it must start with http:// or https://
            </label>
            <input
              className="border-2 border-gray-500 rounded-lg block  p-3 w-full "
              placeholder="paste the link.."
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </form>
          {url}
        </nav>

        <section className="p-2">
          <div className=" px-3 py-6 border border-gray-400 rounded-md mb-4 space-y-3">
            <p>
              <span className=" font-bold">website: </span>
              <span className=" font-bold text-3xl text-green-500">
                {website.domain}
              </span>
            </p>
            <p>
              <span className=" font-bold">title: </span>
              {website.title
                ? website.title
                : "this website didn't provide a title"}
            </p>
            <p>
              <span className=" font-bold">description: </span>
              {website.description
                ? website.description
                : "this website didn't provide a description"}
            </p>
          </div>
          <div className=" px-3 py-6 border border-gray-400 rounded-md grid grid-cols-2 gap-6 text-center mb-4">
            <p>
              <span className=" text-4xl">23</span> <br /> don't trust this
              website
            </p>
            <p>
              <span className=" text-4xl">56</span> <br /> trusts this website
            </p>
            <p>
              <span className=" text-4xl">12</span> <br /> commented on the
              website
            </p>
            <p>
              <span className=" text-4xl">102</span> <br /> have seached for
              this website
            </p>
          </div>
          <div>
            <h3 className=" font-semibold text-xl">Comments</h3>
          </div>
        </section>
        <div className=" bg-slate-200 fixed bottom-0 left-0 w-full grid grid-cols-8 gap-3 p-2">
          <p className=" col-span-4 text-sm font-semibold">
            Do you trust this website?
          </p>
          <button className=" col-span-2 bg-red-300 border-2 border-red-600 rounded-md p-2">
            No
          </button>
          <button className=" col-span-2 bg-green-300 border-2 border-green-600 rounded-md p-2">
            Yes
          </button>
        </div>
      </main>
    </>
  )
}
