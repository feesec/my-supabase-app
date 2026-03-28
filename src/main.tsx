import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { supabase } from './supabaseClient'
import './index.css'

function App() {
  const [todos, setTodos] = useState<any[]>([])
  const [input, setInput] = useState('')

  const fetchTodos = async () => {
    const { data: todos, error } = await supabase.from('todos').select()
    
    if (error) {
      console.error('获取数据失败:', error)
      return
    }

    if (todos) {
      console.log('获取到数据:', todos)
      setTodos(todos)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAddTodo = async () => {
    if (!input.trim()) return

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: input, is_completed: false }])

    if (error) {
      console.error('创建失败:', error)
      return
    }

    console.log('创建成功:', data)
    setInput('')
    fetchTodos()
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Todo List</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="输入新的 todo..."
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button
          onClick={handleAddTodo}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          添加
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.task}</li>
        ))}
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)