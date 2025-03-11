import React, { useState, useEffect } from 'react'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import { PlusIcon, MinusIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ListItem {
  title: string
  items?: ListItem[]
}

interface EditableListProps {
  value: string | ListItem[] | any[]
  onChange: (data: ListItem[]) => void
  name?: string
  placeholder?: string
  readonly?: boolean
  label?: string
  maxLevel?: number
}

// 将输入值解析为 ListItem[] 格式
const parseValue = (value: string | any[] | undefined): ListItem[] => {
  if (!value) return [];
  
  try {
    // 如果是字符串，尝试解析成 JSON
    if (typeof value === 'string') {
      return JSON.parse(value).map((item: any) => normalizeItem(item));
    }
    
    // 如果已经是数组，直接返回规范化后的结果
    if (Array.isArray(value)) {
      return value.map(item => normalizeItem(item));
    }
    
    // 其他情况返回空数组
    return [];
  } catch (error) {
    console.error('Failed to parse value:', error);
    return [];
  }
}

// 规范化 item 格式，处理不同的属性命名
const normalizeItem = (item: any): ListItem => {
  if (typeof item === 'string') {
    return { title: item };
  }
  
  const title = item.title || item.value || '';
  let items;
  
  if (item.items && Array.isArray(item.items)) {
    items = item.items.map((subItem: any) => normalizeItem(subItem));
  } else if (item.children && Array.isArray(item.children)) {
    items = item.children.map((subItem: any) => normalizeItem(subItem));
  }
  
  return { 
    title,
    ...(items && items.length > 0 ? { items } : {}) 
  };
}

// 深度比较两个值是否相等
const isEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (
    typeof a !== 'object' || 
    typeof b !== 'object' || 
    a === null || 
    b === null
  ) {
    return false;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }
  
  return true;
}

const EditableListItem: React.FC<{
  item: ListItem
  index: number
  onUpdate: (index: number, newValue: string, newChildren?: ListItem[]) => void
  onDelete: (index: number) => void
  onAdd: (parentIndex: number) => void
  level?: number
  maxLevel?: number
  readonly?: boolean
}> = ({ item, index, onUpdate, onDelete, onAdd, level = 0, maxLevel = Infinity, readonly = false }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = item.items && item.items.length > 0
  const canAddChildren = maxLevel ? level < maxLevel - 1 : true

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 my-2">
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={readonly}
            type="button"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}
        
        {!hasChildren && level > 0 && <div className="w-6" />}
        
        <Input
          type="text"
          value={item.title}
          onChange={(e) => !readonly && onUpdate(index, e.target.value)}
          className="flex-1 hover:border-primary-400 focus:ring-1 focus:ring-primary-400"
          disabled={readonly}
        />
        
        {!readonly && (
          <div className="flex items-center gap-1">
            {canAddChildren && (
              <Button
                size="small"
                variant="secondary"
                className="!p-1"
                onClick={() => onAdd(index)}
                type="button"
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="small"
              variant="secondary"
              className="!p-1"
              onClick={() => onDelete(index)}
              type="button"
            >
              <MinusIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {isExpanded && hasChildren && (
        <div className="ml-4 pl-2 border-l border-gray-200">
          {item.items!.map((child, childIndex) => (
            <EditableListItem
              key={childIndex}
              item={child}
              index={childIndex}
              level={level + 1}
              maxLevel={maxLevel}
              readonly={readonly}
              onUpdate={(idx, value, newChildren) => {
                const newItems = [...item.items!]
                if (newChildren) {
                  newItems[idx] = { 
                    title: value,
                    items: newChildren
                  }
                } else {
                  newItems[idx] = { 
                    ...newItems[idx],
                    title: value
                  }
                }
                onUpdate(index, item.title, newItems)
              }}
              onDelete={(idx) => {
                const newItems = item.items!.filter((_, i) => i !== idx)
                onUpdate(index, item.title, newItems)
              }}
              onAdd={(idx) => {
                if (!canAddChildren) return
                const newItems = [...item.items!]
                newItems.splice(idx + 1, 0, { title: '新项目' })
                onUpdate(index, item.title, newItems)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const EditableList: React.FC<EditableListProps> = ({ 
  value, 
  onChange, 
  name, 
  placeholder = '新项目',
  readonly = false,
  maxLevel
}) => {
  // 解析输入值
  const parsedValue = parseValue(value)
  const [items, setItems] = useState<ListItem[]>(parsedValue)
  
  // 当外部 value 变化时更新内部状态
  useEffect(() => {
    const newParsedValue = parseValue(value)
    // 避免不必要的更新
    if (!isEqual(items, newParsedValue)) {
      setItems(newParsedValue)
    }
  }, [value])

  const handleUpdate = (index: number, newValue: string, newChildren?: ListItem[]) => {
    const newItems = [...items]
    if (newChildren) {
      newItems[index] = {
        title: newValue,
        items: newChildren
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        title: newValue
      }
    }
    setItems(newItems)
    onChange(newItems)
  }

  return (
    <div className="w-full border rounded-lg p-4 bg-white">
      {name && <input type="hidden" name={name} value={JSON.stringify(items)} />}
      
      {items.map((item, index) => (
        <EditableListItem
          key={index}
          item={item}
          index={index}
          maxLevel={maxLevel}
          readonly={readonly}
          onUpdate={handleUpdate}
          onDelete={(idx) => {
            const newItems = items.filter((_, i) => i !== idx)
            setItems(newItems)
            onChange(newItems)
          }}
          onAdd={(idx) => {
            const newItems = [...items]
            newItems.splice(idx + 1, 0, { title: placeholder })
            setItems(newItems)
            onChange(newItems)
          }}
        />
      ))}
      
      {!readonly && (
        <Button
          variant="secondary"
          className="mt-2"
          onClick={() => {
            const newItems = [...items, { title: placeholder }]
            setItems(newItems)
            onChange(newItems)
          }}
          type="button"
        >
          添加节点
        </Button>
      )}
    </div>
  )
}

export default EditableList 