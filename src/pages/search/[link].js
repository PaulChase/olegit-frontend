import Head from 'next/head'
import Link from 'next/link'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

export async function getServerSideProps(context) {
  // Fetch data from external API
  const res = await axios.get(`/api/links?link=${context.params.link}`)

  const data = await res.data.data

  // Pass data to the page via props
  return { props: { data } }
}

export default function LinkPage({ data }) {
  // const { user } = useAuth({ middleware: 'guest' })
  const router = useRouter()
  const { link } = router.query // get the link param from URL
  const [url, setUrl] = useState(link)
  const [website, setWebsite] = useState(data)
  const [voteButtons, setVoteButtons] = useState(true)
  const [commentBox, setCommentBox] = useState(false)
  const [comment, setComment] = useState({
    link_id: website.id,
    user_name: '',
    user_comment: '',
  })
  const [canComment, setCanComment] = useState(true)
  const [isPending, setIsPending] = useState(false)

  // get the data of the new website that was submitted
  const getWebsite = async () => {
    setIsPending(true)

    const res = await axios.get(`/api/links?link=${url}`)
    // const data = await res.json()
    const data = await res.data.data

    setWebsite(data)
    setIsPending(false)
  }

  const submitLink = e => {
    e.preventDefault()
    getWebsite()
  }

  // submit comment to server
  const submitComment = e => {
    e.preventDefault()
    axios
      .post('/api/comments', comment)
      .then(res => {
        setCommentBox(false)
        setCanComment(false)
        setComment({ ...comment, user_comment: '' })
        localStorage.setItem('commented', website.id)
        localStorage.setItem('user_name', comment.user_name)
      })
      .catch(err => console.error(err))
  }

  const submitVote = vote => {
    axios
      .post('/api/votes', { link_id: website.id, vote })
      .then(res => {
        console.log(res.data)
        setVoteButtons(false)
        localStorage.setItem('voted', website.id)
        getWebsite()
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    const ifCommented = localStorage.getItem('commented')
    const ifVoted = localStorage.getItem('voted')
    const userName = localStorage.getItem('user_name')

    // hide the 'add comment button' if the user has made a comment before
    if (ifCommented == website.id) {
      setCanComment(false)
    } else {
      setCanComment(true)
    }

    // hide the 'vote buttons' if the user has made a vote before

    if (ifVoted == website.id) {
      setVoteButtons(false)
    } else {
      setVoteButtons(true)
    }

    // remeber the user's name for upcoming comments
    if (userName) {
      setComment({ ...comment, user_name: userName })
    } else {
      setComment({ ...comment, user_name: '' })
    }
  }, [website])

  return (
    <>
      <Head>
        <title>search page</title>
      </Head>

      <main className=" pb-20">
        <nav className=" mb-4 border-b-2 border-gray-400 p-3 lg:flex lg:items-center lg:justify-between">
          <Link href="/">
            <a className="text-3xl text-center font-extrabold uppercase text-blue-700 mb-2 lg:text-4xl">
              o'legit
            </a>
          </Link>

          <form
            action=""
            onSubmit={submitLink}
            className=" flex justify-between items-center">
            <div className=" w-full">
              <label htmlFor="" className=" text-xs mb-3 block">
                <b>note:</b> it must start with http:// or https://
              </label>
              <input
                className="border-2 border-gray-500 rounded-lg block  py-2 px-3 w-full lg:w-[32rem] "
                placeholder="paste the link.."
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>
            {isPending ? (
              <button
                type="submit"
                className=" bg-blue-400  rounded-md uppercase py-2 px-4 font-bold text-white hover:bg-blue-600 text-sm ml-3 self-end">
                searching
              </button>
            ) : (
              <button
                type="submit"
                className=" bg-blue-600  rounded-md uppercase py-2 px-4 font-bold text-white hover:bg-blue-800 ml-3 self-end">
                &#10140;
              </button>
            )}
          </form>
        </nav>

        <section className="p-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:text-xl max-w-7xl mx-auto">
          <div>
            <div className=" px-3 py-6 border border-gray-400 rounded-md mb-4 space-y-3">
              <p>
                <span className=" font-bold">website: </span>
                <span className=" font-bold text-3xl text-blue-600">
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

            {/* stats section */}
            <div className=" px-3 py-6 border border-gray-400 rounded-md grid grid-cols-2 gap-8 text-center mb-4">
              <p>
                <span className=" text-4xl font-bold text-red-600">
                  {website?.mistrusts}
                </span>{' '}
                <br /> don't trust this website
              </p>
              <p>
                <span className=" text-4xl font-bold text-green-600">
                  {website?.trusts}
                </span>{' '}
                <br /> trusts this website
              </p>
              <p>
                <span className=" text-4xl">{website?.comments.length}</span>{' '}
                <br /> commented on the website
              </p>
              <p>
                <span className=" text-4xl">{website?.queries}</span> <br />{' '}
                have seached for this website
              </p>
            </div>
            {/* end of stats section */}
          </div>

          {/* visit website */}

          <div>
            <a
              href={link}
              className=" border border-gray-400 rounded-md text-center font-medium p-3 my-4 block focus:border-green-500 lg:mt-0"
              target="_blank">
              {' '}
              Visit website
            </a>

            <div>
              <div className=" flex justify-between items-center">
                <h3 className=" font-semibold text-xl">Comments</h3>

                {canComment && (
                  <button
                    className=" font-semibold bg-blue-200 text-blue-600 p-2 rounded-md"
                    onClick={() => setCommentBox(true)}>
                    Add Comment
                  </button>
                )}
              </div>

              {website?.comments.map(comment => (
                <div
                  key={comment.id}
                  className=" border border-gray-400 rounded-md my-4 p-3">
                  <div className=" flex items-center mb-2">
                    <span className=" py-2 px-4 font-extrabold bg-green-400 text-white rounded-md mr-3">
                      {comment.user_name.slice(0, 1).toUpperCase()}
                    </span>
                    <h4 className=" font-semibold text-base">
                      {comment.user_name}
                    </h4>
                  </div>
                  <p>{comment.user_comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {voteButtons && (
              <div className=" bg-slate-200 fixed bottom-0 left-0 rounded-t-md w-full grid grid-cols-8 gap-3 p-2 lg:static lg:rounded-md">
                <p className=" col-span-4 text-sm font-semibold lg:text-base">
                  Do you trust this website?
                </p>
                <button
                  className=" col-span-2 bg-red-300 border-2 border-red-600 rounded-md p-2 font-semibold"
                  onClick={() => submitVote(0)}>
                  No
                </button>
                <button
                  className=" col-span-2 bg-green-300 border-2 border-green-600 rounded-md p-2 font-semibold"
                  onClick={() => submitVote(1)}>
                  Yes
                </button>
              </div>
            )}

            {/* comment box */}
            {commentBox && (
              <div className=" fixed bg-gray-800 bg-opacity-60  h-full w-full z-30 top-0 left-0  text-gray-700 lg:static lg:h-auto lg:w-auto lg:mt-4">
                <div className=" p-3 absolute  bg-gray-50   bottom-0 w-full rounded-t-lg lg:relative lg:w-auto lg:rounded-md">
                  <button
                    className=" font-extrabold m-3 bg-gray-300 rounded-full py-1 px-3 block text-xl float-right "
                    onClick={() => setCommentBox(false)}>
                    X
                  </button>
                  <h2 className=" font-semibold text-lg ">Add your Comment</h2>
                  <small className=" my-3 font-medium">
                    Note: Every comment submitted is cross checked manually
                    against spam, biased and false info before it appears on the
                    site.{' '}
                  </small>
                  <form
                    action=""
                    className=" space-y-3 py-3"
                    onSubmit={submitComment}>
                    <div>
                      <label htmlFor="" className=" font-semibold mb-2 block">
                        Your Name:
                      </label>
                      <input
                        className="border-2 border-gray-500 rounded-lg block  p-3 w-full  focus:outline-none focus:ring-2 focus:ring-green-500 "
                        placeholder="enter your name..."
                        type="text"
                        value={comment.user_name}
                        onChange={e =>
                          setComment({ ...comment, user_name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        className=" w-full outline-none  mt-1 border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        name=""
                        id=""
                        cols="30"
                        rows="5"
                        value={comment.user_comment}
                        onChange={e =>
                          setComment({
                            ...comment,
                            user_comment: e.target.value,
                          })
                        }
                        required
                        placeholder=" enter your comment here..."></textarea>
                    </div>
                    <button
                      type="submit"
                      className=" bg-blue-600 w-full rounded-md uppercase p-2 font-bold text-white">
                      Sumbit comment
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
