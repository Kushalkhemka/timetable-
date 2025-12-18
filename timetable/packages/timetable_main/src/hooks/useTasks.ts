import { useState, useCallback } from 'react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  color?: string;
  checked?: boolean;
  type: 'checkbox' | 'dot';
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    office: [
      { id: '1', title: 'Meeting with Clients', completed: true, category: 'office' },
      { id: '2', title: 'Create an adaptive UI', completed: false, category: 'office' },
      { id: '3', title: 'Design & wireframe for iOS', completed: false, category: 'office' },
      { id: '4', title: 'Meeting with My Team', completed: false, category: 'office' },
    ],
    personal: [
      { id: '1', title: 'Buy lamp for lovely Grandpa', completed: true, category: 'personal' },
      { id: '2', title: 'Go to Jolly\'s Mart', completed: false, category: 'personal' },
      { id: '3', title: 'Pick burger at Mama Bear Cafe', completed: true, category: 'personal' },
      { id: '4', title: 'Order Pizza for big fams', completed: false, category: 'personal' },
      { id: '5', title: 'Pick wife for shopping', completed: false, category: 'personal' },
      { id: '6', title: 'Go to clinic for checkup', completed: false, category: 'personal' },
    ],
    life: [
      { id: '1', title: 'Breakfast at Tom\'s House', completed: true, category: 'life' },
      { id: '2', title: 'Cycling Through The Valley', completed: true, category: 'life' },
      { id: '3', title: 'Buying Household Necessities', completed: true, category: 'life' },
      { id: '4', title: 'Meeting with Andy', completed: false, category: 'life' },
      { id: '5', title: 'Taking Angel to Piano Lessons', completed: false, category: 'life' },
    ]
  });

  const [categories, setCategories] = useState<TaskCategory[]>([
    { id: '1', name: 'My Schedules', checked: true, type: 'checkbox' },
    { id: '2', name: 'Task and Events', checked: true, type: 'checkbox' },
    { id: '3', name: 'Projects', checked: false, type: 'checkbox' },
    { id: '4', name: 'Holidays', checked: false, type: 'checkbox' },
  ]);

  const addTask = useCallback((category: string, title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      category
    };
    
    setTasks(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newTask]
    }));
  }, []);

  const toggleTask = useCallback((category: string, taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category]?.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ) || []
    }));
  }, []);

  const deleteTask = useCallback((category: string, taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category]?.filter(task => task.id !== taskId) || []
    }));
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, checked: !cat.checked } : cat
    ));
  }, []);

  const addCategory = useCallback((name: string, type: 'checkbox' | 'dot', color?: string) => {
    const newCategory: TaskCategory = {
      id: Date.now().toString(),
      name,
      type,
      color,
      checked: true
    };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  return {
    tasks,
    categories,
    addTask,
    toggleTask,
    deleteTask,
    toggleCategory,
    addCategory
  };
};
