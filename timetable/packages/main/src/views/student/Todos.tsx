import React, { useState } from 'react';
import { Card, TextInput, Button, Checkbox, Label } from 'flowbite-react';
import PageHeader from './components/PageHeader';

type Todo = { id: number; text: string; done: boolean };

const StudentTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Finish Math assignment', done: false },
    { id: 2, text: 'Read chapter 5', done: true },
  ]);
  const [text, setText] = useState('');

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos((t) => [{ id: Date.now(), text, done: false }, ...t]);
    setText('');
  };

  const toggleTodo = (id: number) => {
    setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="To-DOs" subtitle="Track and complete your tasks" />
      <Card className="p-4 md:p-6">
        <div className="flex gap-3 mb-4">
          <TextInput value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a task" className="flex-1" />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <div className="space-y-3">
          {todos.map((todo) => (
            <label key={todo.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={todo.done} onChange={() => toggleTodo(todo.id)} />
              <span className={`${todo.done ? 'line-through text-gray-500' : ''}`}>{todo.text}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StudentTodos;


