// 修改日期2025-01-13
// 新增select的html標籤在markdown
// 下拉式選單

import React, { useEffect, useState, useCallback } from 'react'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import Textarea from '@/app/components/base/textarea'
import { useChatContext } from '@/app/components/base/chat/chat/context'
import cn from '@/utils/classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import Switch from '@/app/components/base/switch'
import Radio from '@/app/components/base/radio'
import Checkbox from '@/app/components/base/checkbox'

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
  RANGE = 'range',
}

export type TagProps = {
  tag: string
  id: string
  level: number
  path: string[]
  child_properties: Record<string, any>
  value: any
  onChange: (value: any) => void
  property_type: string
}

export const supportedTags = [
  {
    tag: 'TEXTAREA',
    getter: (value: any) => value || '',
    component: (props: TagProps) => {
      const { value, onChange, child_properties, property_type } = props
      return (
        <Textarea
          className="!bg-white !border !border-gray-200"
          name={props.id}
          value={value || ''}
          placeholder={child_properties?.placeholder || ''}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          disabled={child_properties?.disabled || false}
          required={child_properties?.required || false}
        />
      )
    },
  },
  {
    tag: 'INPUT',
    getter: (value: any) => value || '',
    component: (props: TagProps) => {
      const { value, onChange, child_properties, property_type } = props
      const [currentType, setCurrentType] = useState<string>(
        child_properties?.type || 'text'
      )
      
      useEffect(() => {
        // Update type when child_properties.type changes
        if (child_properties?.type && child_properties.type !== currentType) {
          setCurrentType(child_properties.type)
        }
      }, [child_properties?.type, currentType])

      // Log warning for unsupported input types
      useEffect(() => {
        const supportedTypes = ['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'range', 'checkbox', 'radio', 'date', 'time', 'datetime-local', 'color']
        if (currentType && !supportedTypes.includes(currentType)) {
          console.warn(`Input type '${currentType}' is not fully supported. Fallback to text input.`)
        }
      }, [currentType])

      if (currentType === 'checkbox') {
        return (
          <div className="flex items-center">
            <Checkbox
              checked={!!value}
              onCheck={() => {
                onChange(!value)
              }}
              disabled={!!child_properties?.disabled}
            />
            {child_properties?.label && (
              <span className="ml-2">{child_properties.label}</span>
            )}
          </div>
        )
      }

      if (currentType === 'radio') {
        // Radio should have options property in the format: "option1:Option 1|option2:Option 2|option3:Option 3"
        const options = (child_properties?.options || '')
          .split('|')
          .map((option: string) => {
            const [value, label] = option.split(':')
            return { value, label: label || value }
          })
          .filter((option: {value: string, label: string}) => option.value)

        if (options.length === 0) {
          return <div className="text-red-500">Radio options not provided</div>
        }

        return (
          <Radio.Group
            value={value || ''}
            onChange={onChange}
            className="block space-y-2 bg-transparent"
          >
            {options.map((option: {value: string, label: string}) => (
              <Radio 
                key={option.value} 
                value={option.value}
                className="flex items-center"
              >
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        )
      }

      if (currentType === 'range') {
        const min = child_properties?.min || 0
        const max = child_properties?.max || 100
        const step = child_properties?.step || 1
        const currentValue = value !== undefined && value !== null ? value : min
        
        return (
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{min}</span>
              <span>{max}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                className="w-full"
                value={currentValue}
                min={min}
                max={max}
                step={step}
                onChange={(e) => {
                  onChange(e.target.value)
                }}
                disabled={child_properties?.disabled || false}
              />
              <span className="text-sm text-gray-700 min-w-[40px]">{currentValue}</span>
            </div>
          </div>
        )
      }
      
      // Date and time inputs
      if (['date', 'time', 'datetime-local'].includes(currentType)) {
        return (
          <input
            type={currentType}
            className="block w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            min={child_properties?.min || ''}
            max={child_properties?.max || ''}
            disabled={child_properties?.disabled || false}
            required={child_properties?.required || false}
          />
        )
      }
      
      // Color picker
      if (currentType === 'color') {
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="w-10 h-10 p-1 bg-white border border-gray-200 rounded-lg cursor-pointer"
              value={value || '#000000'}
              onChange={(e) => {
                onChange(e.target.value)
              }}
              disabled={child_properties?.disabled || false}
            />
            <span className="text-sm text-gray-700">{value || '#000000'}</span>
          </div>
        )
      }
      
      // Default to text-like inputs
      return (
        <Input
          className="bg-white"
          id={props.id}
          name={props.id}
          type={currentType}
          value={value || ''}
          placeholder={child_properties?.placeholder || ''}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          disabled={child_properties?.disabled || false}
          required={child_properties?.required || false}
        />
      )
    },
  },
  {
    tag: 'SELECT',
    getter: (value: any) => value || '',
    component: (props: TagProps) => {
      const { value, onChange, child_properties, property_type } = props
      const [localValue, setLocalValue] = useState(value)
      const [isOpen, setIsOpen] = useState(false)
      const dropdownRef = React.useRef<HTMLDivElement>(null)
      
      useEffect(() => {
        setLocalValue(value)
      }, [value])

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false)
          }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }, [])

      const options = (child_properties?.options || '')
        .split('|')
        .map((option: string) => {
          const [value, label] = option.split(':')
          return { value, label: label || value }
        })
        .filter((option: {value: string, label: string}) => option.value)

      // 确保选项值的唯一性
      const valueMap = new Map();
      const hasDuplicates = options.some((opt: {value: string, label: string}) => {
        if (valueMap.has(opt.value)) return true;
        valueMap.set(opt.value, true);
        return false;
      });
      
      const uniqueOptions = hasDuplicates ? 
        options.map((opt: {value: string, label: string}, index: number) => ({
          ...opt,
          uniqueValue: `${opt.value}_${index}`
        })) : 
        options.map((opt: {value: string, label: string}) => ({ ...opt, uniqueValue: opt.value }));
        
      // 查找当前选中的选项
      const selectedOption = uniqueOptions.find(
        (opt: {value: string, label: string, uniqueValue: string}) => 
          opt.uniqueValue === localValue
      );
      
      const handleSelectOption = (optionValue: string) => {
        setLocalValue(optionValue);
        onChange(optionValue);
        setIsOpen(false);
      };

      return (
        <div className="relative w-full" ref={dropdownRef}>
          {/* 选择框触发器 */}
          <div 
            className={`flex items-center justify-between w-full py-2 px-3 bg-white border ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-300`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={localValue ? 'text-gray-900' : 'text-gray-400'}>
              {selectedOption ? selectedOption.label : (child_properties?.placeholder || '请选择')}
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
            <div className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {uniqueOptions.map((option: {label: string, uniqueValue: string}) => (
                <div 
                  key={option.uniqueValue} 
                  className={`py-2 px-3 cursor-pointer ${localValue === option.uniqueValue ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'} transition-colors duration-150`}
                  onClick={() => handleSelectOption(option.uniqueValue)}
                >
                  {option.label}
                </div>
              ))}
              {uniqueOptions.length === 0 && (
                <div className="py-2 px-3 text-gray-400 italic">
                  无可用选项
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    tag: 'SWITCH',
    getter: (value: any) => !!value,
    component: (props: TagProps) => {
      const { value, onChange, child_properties } = props
      
      return (
        <div className="flex items-center">
          <Switch 
            defaultValue={!!value}
            onChange={(checked) => onChange(checked)}
            disabled={!!child_properties?.disabled}
          />
          {child_properties?.label && (
            <span className="ml-2">{child_properties.label}</span>
          )}
        </div>
      )
    },
  },
  {
    tag: 'FILE',
    getter: (value: any) => value || null,
    component: (props: TagProps) => {
      const { value, onChange, child_properties } = props
      const [fileName, setFileName] = useState<string>('')
      
      return (
        <div className="w-full">
          <div className="flex items-center w-full">
            <label 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传文件</span></p>
                <p className="text-xs text-gray-500">{child_properties?.accept ? `支持的格式: ${child_properties.accept}` : '支持的格式: 所有文件'}</p>
              </div>
              <input 
                type="file" 
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFileName(file.name)
                    onChange(file)
                  }
                }}
                accept={child_properties?.accept || '*'}
                disabled={!!child_properties?.disabled}
                required={!!child_properties?.required}
              />
            </label>
          </div>
          {fileName && (
            <div className="mt-2 text-sm text-gray-700">
              已选择文件: {fileName}
            </div>
          )}
        </div>
      )
    },
  },
]

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

        if (child.tagName === SUPPORTED_TAGS.INPUT) {
          if (Object.values(SUPPORTED_TYPES).includes(child.properties.type)) {
            return (
              <div key={index} className="w-full mb-4">
                <input
                  type={child.properties.type}
                  name={child.properties.name}
                  id={child.properties.name}
                  placeholder={child.properties.placeholder}
                  value={formValues[child.properties.name] || ''}
                  onChange={(e) => {
                    handleInputChange(child.properties.name, e.target.value)
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )
          }
          console.warn(`Unsupported input type: ${child.properties.type}`)
          return null
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