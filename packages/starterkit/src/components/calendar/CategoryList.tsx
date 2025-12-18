import React, { useState } from 'react';

interface CategoryItem {
  id: string;
  name: string;
  color?: string;
  checked?: boolean;
  type: 'checkbox' | 'dot';
}

interface CategoryListProps {
  title: string;
  items: CategoryItem[];
  onItemToggle?: (id: string) => void;
  onAddNew?: () => void;
  className?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  title,
  items,
  onItemToggle,
  onAddNew,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {isExpanded ? (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Items */}
      {isExpanded && (
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <button
                onClick={() => onItemToggle?.(item.id)}
                className="w-5 h-5 flex items-center justify-center hover:scale-110 transition-transform"
              >
                {item.type === 'checkbox' ? (
                  item.checked ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-1 bg-white rounded-sm" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-gray-400 transition-colors" />
                  )
                ) : (
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color || '#8A8A8F' }}
                  />
                )}
              </button>
              
              <span 
                className={`flex-1 text-sm font-normal ${
                  item.color && item.type === 'dot' ? '' : 'text-gray-900'
                }`}
                style={item.color && item.type === 'dot' ? { color: item.color } : {}}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Add New Button */}
      {isExpanded && (
        <button
          onClick={onAddNew}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New</span>
        </button>
      )}
      
      <div className="w-full h-px bg-gray-200 mt-6" />
    </div>
  );
};
