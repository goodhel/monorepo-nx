import NextError from 'next/error';
import { useRouter } from "next/router"
import { RouterOutput, trpc } from "../../utils/tprc"

type TodoByIdOutput = RouterOutput['post']['getPost']

const TodoItem = (props: { todo: TodoByIdOutput }) => {
    const { todo } = props
    return (
        <div>
            <h1 className='underline text-xl'>{todo.title}</h1>
        </div>
    )
}

const TodoViewPage = () => {
    const id = useRouter().query.id as string
    const todoQuery = trpc.post.getPost.useQuery({ id: Number(id) })

    if (todoQuery.error) {
        return (
          <NextError
            title={todoQuery.error.message}
            statusCode={todoQuery.error.data?.httpStatus ?? 500}
          />
        );
    }
    
    if (todoQuery.status !== 'success') {
        return <>Loading...</>;
    }

    const { data } = todoQuery
    return <TodoItem todo={data} />
}

export default TodoViewPage