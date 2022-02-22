import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useState } from 'react'

const Dashboard = () => {
  const [comments, setComments] = useState([])
  const [stats, setStats] = useState({})
  const updateCommentStatus = (id, status) => {
    axios
      .put(`/api/comments/${id}`, { status })
      .then(res => console.log(res.data))
      .catch(err => console.error(err))
  }

  const getPendingComments = async () => {
    const res = await axios.get('/api/dashboard')

    const data = await res.data

    setComments(data.comments)
    setStats(data.stats)
    // console.log(res.data)
  }
  useEffect(() => getPendingComments(), [])
  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      }>
      <Head>
        <title>Laravel - Dashboard</title>
      </Head>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className=" bg-white p-3">
            <h2 className=" text-center text-xl font-bold my-4">Your Stats</h2>
            <div className=" px-3 py-6 border border-gray-400 rounded-md grid grid-cols-2 gap-8 text-center mb-4">
              <p>
                <span className=" text-5xl font-bold ">{stats.totalLinks}</span>{' '}
                <br /> total Links
              </p>
              <p>
                <span className=" text-5xl font-bold ">
                  {stats.totalComments}
                </span>{' '}
                <br /> total Comments
              </p>
              <p>
                <span className=" text-5xl font-bold">
                  {stats.totalQueries}
                </span>{' '}
                <br /> total Queries
              </p>
              <p>
                <span className=" text-5xl font-bold">{stats.totalVotes}</span>{' '}
                <br /> total Votes
              </p>
            </div>
          </div>
          <div className="bg-white p-3 my-3 flex justify-between items-center">
            <h3 className=" font-semibold text-xl">Pending Comments</h3>

            <button
              className=" font-semibold bg-green-200 text-green-600 p-2 rounded-md"
              onClick={getPendingComments}>
              Refresh Comments
            </button>
          </div>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-3 grid lg:grid-cols-3 gap-4">
            {comments.map(comment => (
              <div
                key={comment.id}
                className=" border border-gray-400 rounded-md  p-3">
                <div className=" flex items-center mb-2">
                  <span className=" py-2 px-4 font-extrabold bg-green-400 text-white rounded-md mr-3">
                    {comment.user_name.slice(0, 1).toUpperCase()}
                  </span>
                  <h4 className=" font-semibold text-base">
                    {comment.user_name}
                  </h4>
                </div>
                <p>{comment.user_comment}</p>
                <p className=" flex justify-around items-center my-3">
                  <button
                    className="bg-green-300 border-2 border-green-600 rounded-md p-2"
                    onClick={() => updateCommentStatus(comment.id, 2)}>
                    Accept
                  </button>
                  <button
                    className="bg-red-300 border-2 border-red-600 rounded-md p-2"
                    onClick={() => updateCommentStatus(comment.id, 0)}>
                    Delete
                  </button>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard
