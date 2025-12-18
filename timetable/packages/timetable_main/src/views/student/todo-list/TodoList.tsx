import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Textarea } from 'src/components/shadcn-ui/Default-Ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Checkbox } from 'src/components/shadcn-ui/Default-Ui/checkbox';
import { Icon } from '@iconify/react';

const TodoList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('academic');
  const [todos, setTodos] = useState([
    {
      id: '1',
      title: 'Complete Data Structures Assignment',
      description: 'Implement binary search tree operations',
      priority: 'high',
      category: 'academic',
      dueDate: '2024-01-20',
      completed: false,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Prepare for Mid-term Exam',
      description: 'Study chapters 1-5 of Database Systems',
      priority: 'high',
      category: 'academic',
      dueDate: '2024-01-25',
      completed: false,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Submit Project Proposal',
      description: 'Submit the final project proposal for Software Engineering',
      priority: 'medium',
      category: 'academic',
      dueDate: '2024-01-18',
      completed: true,
      createdAt: '2024-01-10'
    },
    {
      id: '4',
      title: 'Renew Library Books',
      description: 'Return and renew borrowed books',
      priority: 'medium',
      category: 'personal',
      dueDate: '2024-01-17',
      completed: false,
      createdAt: '2024-01-12'
    },
    {
      id: '5',
      title: 'Attend Career Guidance Session',
      description: 'Attend the career guidance session at 2 PM',
      priority: 'low',
      category: 'career',
      dueDate: '2024-01-16',
      completed: false,
      createdAt: '2024-01-13'
    },
    {
      id: '6',
      title: 'Complete Lab Report',
      description: 'Write lab report for Programming Lab experiment 3',
      priority: 'medium',
      category: 'academic',
      dueDate: '2024-01-19',
      completed: true,
      createdAt: '2024-01-11'
    }
  ]);

  const categories = [
    { value: 'academic', label: 'Academic', icon: 'solar:graduation-cap-line-duotone' },
    { value: 'personal', label: 'Personal', icon: 'solar:user-line-duotone' },
    { value: 'career', label: 'Career', icon: 'solar:briefcase-line-duotone' },
    { value: 'health', label: 'Health', icon: 'solar:heart-pulse-line-duotone' },
    { value: 'social', label: 'Social', icon: 'solar:users-group-two-rounded-line-duotone' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
  ];

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj ? categoryObj.icon : 'solar:checklist-minimalistic-line-duotone';
  };

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return !todo.completed;
    if (activeTab === 'completed') return todo.completed;
    return todo.category === activeTab;
  });

  const addTask = () => {
    if (!newTask.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      title: newTask,
      description: newTaskDescription,
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTodos([newTodo, ...todos]);
    setNewTask('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskCategory('academic');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">To Do List</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-green-600">{completedCount}</span> completed, 
            <span className="font-semibold text-orange-600 ml-1">{pendingCount}</span> pending
          </div>
        </div>
      </div>

      {/* Add New Task */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Task title..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <Icon icon={category.icon} className="text-sm" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Textarea
            placeholder="Task description (optional)..."
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            rows={2}
          />
          
          <div className="flex gap-4">
            <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={addTask} className="flex-1">
              <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:checklist-minimalistic-line-duotone" className="mr-2" />
          All ({todos.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:clock-circle-line-duotone" className="mr-2" />
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:check-circle-line-duotone" className="mr-2" />
          Completed ({completedCount})
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveTab(category.value)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              activeTab === category.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon icon={category.icon} className="text-sm" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <Card key={todo.id} className={`transition-all ${
            todo.completed ? 'opacity-60' : ''
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                      }`}>
                        {todo.title}
                      </h3>
                      
                      {todo.description && (
                        <p className={`text-sm mt-1 ${
                          todo.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(todo.priority)}>
                          {priorities.find(p => p.value === todo.priority)?.label}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Icon icon={getCategoryIcon(todo.category)} className="text-xs" />
                          {categories.find(c => c.value === todo.category)?.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Icon icon="solar:checklist-minimalistic-line-duotone" className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? 'You have no pending tasks. Great job!' 
                : activeTab === 'completed'
                ? 'You haven\'t completed any tasks yet.'
                : 'No tasks match your current filter.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TodoList;
