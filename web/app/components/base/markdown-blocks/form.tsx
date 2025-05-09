// 修改日期2025-01-13
// 新增select的html標籤在markdown
// 下拉式選單

import React, { useEffect, useState, useCallback } from 'react'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import Textarea from '@/app/components/base/textarea'
import DatePicker from '@/app/components/base/date-and-time-picker/date-picker'
import TimePicker from '@/app/components/base/date-and-time-picker/time-picker'
import Checkbox from '@/app/components/base/checkbox'
import Select from '@/app/components/base/select'
import { useChatContext } from '@/app/components/base/chat/chat/context'
import cn from '@/utils/classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import Switch from '@/app/components/base/switch'
import Radio from '@/app/components/base/radio'

enum DATA_FORMAT {
  TEXT = 'text',
  JSON = 'json',
}
enum SUPPORTED_TAGS {
  LABEL = 'label',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  BUTTON = 'button',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  EDITABLE_LIST = 'editable-list',
}
enum SUPPORTED_TYPES {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
}
const MarkdownForm = ({ node }: any) => {
  const { onSend } = useChatContext()

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({})
  const [collapsedItems, setCollapsedItems] = useState<{ [key: string]: boolean }>({})

  const updateNestedValue = (values: any[], path: number[], newValue: any) => {
    if (path.length === 0) {
      return values
    }

    const [current, ...rest] = path
    const newValues = [...values]
    
    if (rest.length === 0) {
      // 更新当前节点
      if (typeof newValues[current] === 'object') {
        newValues[current] = {
          ...newValues[current],
          title: newValue.title,
          items: newValues[current].items || []
        }
      } else {
        newValues[current] = newValue
      }
    } else {
      // 处理嵌套节点
      if (!newValues[current] || typeof newValues[current] !== 'object') {
        newValues[current] = { title: '', items: [] }
      }
      
      const updatedItems = updateNestedValue(
        newValues[current].items || [],
        rest,
        newValue
      )
      
      newValues[current] = {
        ...newValues[current],
        items: updatedItems
      }
    }
    
    return newValues
  }

  const handleChange = (name: string, value: string, item: any, i: number, path: number[]) => {
    const newValues = [...(formValues[name] || [])]
    
    if (path.length === 0) {
      // 处理顶层节点
      if (typeof item === 'object' && item.items) {
        newValues[i] = {
          ...item,
          title: value,
          items: item.items
        }
      } else {
        newValues[i] = value
      }
      
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: newValues
      }))
    } else {
      // 处理嵌套节点，创建新的路径数组
      const newPath = [...path, i]
      const updatedValues = updateNestedValue(newValues, newPath, {
        title: value,
        items: (typeof item === 'object' && item.items) ? item.items : []
      })
      
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: updatedValues
      }))
    }
  }

  const handleAddSubItem = (name: string, item: any, i: number, path: number[]) => {
    // 递归查找并更新目标节点
    const updateItemAtPath = (items: any[], currentPath: number[]): any[] => {
      const newItems = [...items]
      
      if (currentPath.length === 0) {
        // 到达目标节点
        const targetItem = newItems[i]
        if (typeof targetItem === 'string') {
          newItems[i] = { title: targetItem, items: [''] }
        } else {
          newItems[i] = {
            ...targetItem,
            items: [...(targetItem?.items || []), '']
          }
        }
        return newItems
      }
      
      // 继续递归
      const [current, ...rest] = currentPath
      if (!newItems[current] || typeof newItems[current] !== 'object') {
        newItems[current] = { title: '', items: [] }
      }
      
      newItems[current] = {
        ...newItems[current],
        items: updateItemAtPath(newItems[current].items || [], rest)
      }
      
      return newItems
    }
    
    // 更新状态
    setFormValues(prevValues => {
      const currentValues = [...(prevValues[name] || [])]
      const updatedValues = updateItemAtPath(currentValues, path)
      return {
        ...prevValues,
        [name]: updatedValues
      }
    })
  }

  const handleDelete = (name: string, i: number, path: number[]) => {
    const newValues = [...(formValues[name] || [])]
    if (path.length === 0) {
      newValues.splice(i, 1)
    } else {
      const parentPath = path.slice(0, -1)
      const lastIndex = path[path.length - 1]
      let current = newValues
      for (const index of parentPath) {
        current = current[index].items
      }
      current[lastIndex].items.splice(i, 1)
    }
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: newValues,
    }))
  }

  const handleAddTopLevelItem = (name: string) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: [...(prevValues[name] || []), '']
    }))
  }

  const toggleCollapse = (path: number[], index: number) => {
    // 使用完整路径作为 key，确保每个节点都有唯一的折叠状态
    const itemKey = [...path, index].join('-')
    setCollapsedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }))
  }

  useEffect(() => {
    const initialValues: { [key: string]: any } = {}
    node.children.forEach((child: any) => {
      if (child.tagName === SUPPORTED_TAGS.INPUT) {
        initialValues[child.properties.name] = child.properties.value ?? ''
      }
      if (child.tagName === SUPPORTED_TAGS.TEXTAREA) {
        initialValues[child.properties.name] = child.properties.value ?? ''
      }
      if (child.tagName === SUPPORTED_TAGS.SELECT) {
        initialValues[child.properties.name] = child.properties.value ?? ''
      }
      if (child.tagName === SUPPORTED_TAGS.EDITABLE_LIST) {
        try {
          const listValue = child.properties.value ? JSON.parse(child.properties.value) : []
          initialValues[child.properties.name] = listValue
        } catch {
          initialValues[child.properties.name] = child.properties.value ? [child.properties.value] : []
        }
      }
    })
    setFormValues(initialValues)
  }, [node.children])

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }))
  }

  const getFormValues = (children: any) => {
    const values: { [key: string]: any } = {}
    children.forEach((child: any) => {
      if (child.tagName === SUPPORTED_TAGS.INPUT || 
          child.tagName === SUPPORTED_TAGS.TEXTAREA || 
          child.tagName === SUPPORTED_TAGS.SELECT) {
        values[child.properties.name] = formValues[child.properties.name] ?? ''
      }
      if (child.tagName === SUPPORTED_TAGS.EDITABLE_LIST) {
        values[child.properties.name] = formValues[child.properties.name] ?? []
      }
    })
    return values
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    const format = node.properties.dataFormat || DATA_FORMAT.TEXT
    const result = getFormValues(node.children)

    if (format === DATA_FORMAT.JSON) {
      onSend?.(JSON.stringify(result))
    }
    else {
      const textResult = Object.entries(result)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
      onSend?.(textResult)
    }
  }

  const renderListItem = (item: any, i: number, path: number[] = [], name: string, maxLevel?: number) => {
    // 使用完整路径作为 key
    const itemKey = [...path, i].join('-')
    const isCollapsed = collapsedItems[itemKey]
    const hasSubItems = typeof item === 'object' && item.items && item.items.length > 0
    const currentLevel = path.length
    const canAddSubItems = maxLevel === undefined || currentLevel < maxLevel - 1

    return (
      <div key={i} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {hasSubItems && (
            <Button
              variant="ghost"
              className="!p-1 text-gray-500 hover:text-gray-700"
              onClick={() => toggleCollapse(path, i)}
            >
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )}
          <div className="flex-1">
            <Input
              className="!bg-transparent hover:!bg-white focus:!bg-white transition-colors duration-200 !py-0.5"
              value={typeof item === 'object' ? item.title : item}
              onChange={(e) => handleChange(name, e.target.value, item, i, path)}
            />
          </div>
          <div className="flex items-center gap-1">
            {canAddSubItems && (
              <Button
                variant="ghost"
                className="!p-1 text-gray-500 hover:text-gray-700"
                onClick={() => handleAddSubItem(name, item, i, path)}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            )}
            <Button
              variant="ghost"
              className="!p-1 text-gray-500 hover:text-red-500"
              onClick={() => handleDelete(name, i, path)}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
        {hasSubItems && !isCollapsed && (
          <div className="pl-6">
            {item.items.map((subItem: any, subIndex: number) =>
              renderListItem(subItem, subIndex, [...path, i], name, maxLevel)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <form
      autoComplete="off"
      className='flex flex-col self-stretch gap-4'
      onSubmit={(e: any) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {node.children.filter((i: any) => i.type === 'element').map((child: any, index: number) => {
        if (child.tagName === SUPPORTED_TAGS.LABEL) {
          return (
            <label
              key={child.properties.for}
              htmlFor={child.properties.for}
              className="block text-sm font-medium text-gray-700"
            >
              {child.children[0]?.value || ''}
            </label>
          )
        }
        if (child.tagName === SUPPORTED_TAGS.INPUT && Object.values(SUPPORTED_TYPES).includes(child.properties.type)) {
          if (child.properties.type === SUPPORTED_TYPES.DATE || child.properties.type === SUPPORTED_TYPES.DATETIME) {
            return (
              <DatePicker
                key={index}
                value={formValues[child.properties.name]}
                needTimePicker={child.properties.type === SUPPORTED_TYPES.DATETIME}
                onChange={(date) => {
                  setFormValues(prevValues => ({
                    ...prevValues,
                    [child.properties.name]: date,
                  }))
                }}
                onClear={() => {
                  setFormValues(prevValues => ({
                    ...prevValues,
                    [child.properties.name]: undefined,
                  }))
                }}
              />
            )
          }
          if (child.properties.type === SUPPORTED_TYPES.TIME) {
            return (
              <TimePicker
                key={index}
                value={formValues[child.properties.name]}
                onChange={(time) => {
                  setFormValues(prevValues => ({
                    ...prevValues,
                    [child.properties.name]: time,
                  }))
                }}
                onClear={() => {
                  setFormValues(prevValues => ({
                    ...prevValues,
                    [child.properties.name]: undefined,
                  }))
                }}
              />
            )
          }
          if (child.properties.type === SUPPORTED_TYPES.CHECKBOX) {
            return (
              <div className='mt-2 flex items-center h-6 space-x-2' key={index}>
                <Checkbox
                  key={index}
                  checked={formValues[child.properties.name]}
                  onCheck={() => {
                    setFormValues(prevValues => ({
                      ...prevValues,
                      [child.properties.name]: !prevValues[child.properties.name],
                    }))
                  }}
                />
                <span>{child.properties.dataTip || child.properties['data-tip'] || ''}</span>
              </div>
            )
          }
          if (child.properties.type === SUPPORTED_TYPES.SELECT) {
            return (
              <Select
                key={index}
                allowSearch={false}
                className="w-full"
                items={(() => {
                  let options = child.properties.dataOptions || child.properties['data-options'] || []
                  if (typeof options === 'string') {
                    try {
                      options = JSON.parse(options)
                    }
                    catch (e) {
                      console.error('Failed to parse options:', e)
                      options = []
                    }
                  }
                  return options.map((option: string) => ({
                    name: option,
                    value: option,
                  }))
                })()}
                defaultValue={formValues[child.properties.name]}
                onSelect={(item) => {
                  setFormValues(prevValues => ({
                    ...prevValues,
                    [child.properties.name]: item.value,
                  }))
                }}
              />
            )
          }

          return (
            <Input
              key={index}
              type={child.properties.type}
              name={child.properties.name}
              placeholder={child.properties.placeholder}
              value={formValues[child.properties.name]}
              onChange={(e) => {
                setFormValues(prevValues => ({
                  ...prevValues,
                  [child.properties.name]: e.target.value,
                }))
              }}
            />
          )
        }
        if (child.tagName === SUPPORTED_TAGS.TEXTAREA) {
          return (
            <div key={index} className="w-full bg-white border border-gray-200 rounded-md overflow-hidden">
              <Textarea
                name={child.properties.name}
                id={child.properties.name}
                placeholder={child.properties.placeholder}
                value={formValues[child.properties.name] || ''}
                onChange={(e) => {
                  handleChange(child.properties.name, e.target.value, child.properties.value, 0, [])
                }}
                className="bg-white border-gray-200"
              />
            </div>
          )
        }
        if (child.tagName === SUPPORTED_TAGS.SELECT) {
          // 获取所有选项并处理唯一性
          const options = child.children
            .filter((option: any) => option.type === 'element' && option.tagName === 'option')
            .map((option: any, index: number) => {
              const value = option.properties.value;
              const label = option.children[0]?.value || '';
              return { value, label, index };
            });
            
          // 检查是否有重复值
          const valueMap = new Map();
          const hasDuplicates = options.some((opt: {value: string}) => {
            if (valueMap.has(opt.value)) return true;
            valueMap.set(opt.value, true);
            return false;
          });
          
          // 如果有重复值，为每个选项生成唯一值
          const uniqueOptions = hasDuplicates ? 
            options.map((opt: {value: string, label: string, index: number}) => ({
              ...opt,
              uniqueValue: `${opt.value}_${opt.index}`
            })) : 
            options.map((opt: {value: string, label: string}) => ({ 
              ...opt, 
              uniqueValue: opt.value 
            }));
          
          // 当前选中选项
          const currentValue = formValues[child.properties.name] || '';
          const [isOpen, setIsOpen] = useState(false);
          const dropdownRef = React.useRef<HTMLDivElement>(null);
          
          // 处理点击外部关闭菜单
          useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
              if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
              }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
              document.removeEventListener('mousedown', handleClickOutside);
            };
          }, []);
          
          // 获取当前选中选项的标签
          const currentOption = uniqueOptions.find((opt: {uniqueValue: string}) => opt.uniqueValue === currentValue);
          const currentLabel = currentOption?.label || '';
            
          return (
            <div key={index} className="w-full">
              <div className="relative" ref={dropdownRef}>
                {/* 自定义选择触发器 */}
                <div
                  className={`flex items-center justify-between w-full py-2 px-3 bg-white border ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-300`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={currentValue ? 'text-gray-900' : 'text-gray-400'}>
                    {currentLabel || (child.properties.placeholder || '请选择')}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* 下拉选项菜单 */}
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {uniqueOptions.map((option: {label: string, uniqueValue: string, index: number}) => (
                      <div
                        key={option.index}
                        className={`py-2 px-3 cursor-pointer ${currentValue === option.uniqueValue ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'} transition-colors duration-150`}
                        onClick={() => {
                          const newValue = option.uniqueValue;
                          handleInputChange(child.properties.name, newValue);
                          setIsOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }
        if (child.tagName === SUPPORTED_TAGS.BUTTON) {
          const variant = child.properties.dataVariant
          const size = child.properties.dataSize

          return (
            <Button
              variant={variant}
              size={size}
              className='mt-4'
              key={index}
              onClick={onSubmit}
            >
              <span className='text-[13px]'>{child.children[0]?.value || ''}</span>
            </Button>
          )
        }
        if (child.tagName === SUPPORTED_TAGS.EDITABLE_LIST) {
          const isNested = child.properties.nested === 'true'
          const maxLevel = child.properties['max-level'] ? parseInt(child.properties['max-level'], 10) : undefined
          
          return (
            <div key={index} className="flex flex-col gap-2 my-2">
              <div className="flex flex-col gap-1">
                {(formValues[child.properties.name] || []).map((item: any, i: number) => 
                  renderListItem(item, i, [], child.properties.name, maxLevel)
                )}
              </div>
              {(!maxLevel || maxLevel > 0) && (
                <Button
                  variant="ghost"
                  className="self-start !px-2 !py-1 text-gray-500 hover:text-primary border border-dashed border-gray-300 hover:border-primary rounded transition-colors duration-200"
                  onClick={() => handleAddTopLevelItem(child.properties.name)}
                >
                  <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm">添加节点</span>
                </Button>
              )}
            </div>
          )
        }

        return null
      })}
    </form>
  )
}
MarkdownForm.displayName = 'MarkdownForm'
export default MarkdownForm