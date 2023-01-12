import Head from 'next/head'
// import { Inter } from '@next/font/google'
import { trpc } from '../utils/tprc'
import { Fragment, useState } from 'react'
import { inferProcedureInput } from '@trpc/server';
import type { AppRouter } from 'server/src/app'
import Link from 'next/link';

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const listTodo = trpc.post.listPosts.useQuery()
  const utils = trpc.useContext()
  const [title, setTitle] = useState('')

  const addTodo = trpc.post.createPost.useMutation({
    async onSuccess() {
      // refetch the list of todos
      await utils.post.listPosts.invalidate()
    }
  })

  const postTodo = async () => {
    const input = {
      title
    }

    try {
      await addTodo.mutateAsync(input);
      setTitle('')
    } catch (error) {
      console.error({ error }, 'Failed to add post');
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h2 className='text-3xl font-bold underline'>
            Latest Todos
            {listTodo.status === 'loading' && '(loading)'}
          </h2>

          {listTodo.data?.map((todo) => (
            <article key={todo.id} className='flex gap-2'>
              <h3>{todo.title}</h3>
              <Link href={`/todo/${todo.id}`}>View More</Link>
            </article>
          ))}

          <h3 className='text-3xl font-bold underline'>Add a Post</h3>
        </div>

        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form 
                onSubmit={async (e) => {
                  /**
                   * In a real app you probably don't want to use this manually
                   * Checkout React Hook Form - it works great with tRPC
                   * @see https://react-hook-form.com/
                   * @see https://kitchen-sink.trpc.io/react-hook-form
                   */
                  e.preventDefault();

                  await postTodo();
                }}
              >
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label  className="block text-sm font-medium text-gray-700">Title</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          {/* <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">http://</span> */}
                          <input type="text" name="title" id="title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="www.example.com"
                            disabled={addTodo.isLoading}
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>
                  </div>
                    {addTodo.error && (
                      <p style={{ color: 'red' }}>{addTodo.error.message}</p>
                    )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
