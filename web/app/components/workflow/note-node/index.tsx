import {
  memo,
  useCallback,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useClickAway } from 'ahooks'
import type { NodeProps } from 'reactflow'
import NodeResizer from '../nodes/_base/components/node-resizer'
import {
  useNodeDataUpdate,
  useNodesInteractions,
} from '../hooks'
import { useStore } from '../store'
import {
  NoteEditor,
  NoteEditorContextProvider,
  NoteEditorToolbar,
} from './note-editor'
import { THEME_MAP } from './constants'
import { useNote } from './hooks'
import type { NoteNodeType } from './types'
import cn from '@/utils/classnames'
import { Markdown } from '@/app/components/base/markdown'
import { Edit04 } from '@/app/components/base/icons/src/vender/line/general'
import Button from '@/app/components/base/button'

const Icon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 9.75V6H13.5V9.75C13.5 11.8211 11.8211 13.5 9.75 13.5H6V12H9.75C10.9926 12 12 10.9926 12 9.75Z" fill="black" fillOpacity="0.16" />
    </svg>
  )
}

const NoteNode = ({
  id,
  data,
}: NodeProps<NoteNodeType>) => {
  const { t } = useTranslation()
  const controlPromptEditorRerenderKey = useStore(s => s.controlPromptEditorRerenderKey)
  const ref = useRef<HTMLDivElement | null>(null)
  const theme = data.theme

  // Parse the text content if it's JSON
  const getMarkdownContent = useCallback((text: string) => {
    try {
      const parsed = JSON.parse(text)
      // If it's a Lexical editor state, try to extract the text content
      if (parsed.root?.children) {
        return parsed.root.children
          .map((node: any) => {
            if (node.type === 'paragraph' && node.children) {
              return node.children
                .map((child: any) => child.text || '')
                .join('')
            }
            return ''
          })
          .join('\n')
      }
      return text
    } catch {
      return text
    }
  }, [])

  const {
    handleThemeChange,
    handleEditorChange,
    handleShowAuthorChange,
  } = useNote(id)
  const {
    handleNodesCopy,
    handleNodesDuplicate,
    handleNodeDelete,
  } = useNodesInteractions()
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()

  const handleDeleteNode = useCallback(() => {
    handleNodeDelete(id)
  }, [id, handleNodeDelete])

  const handleEditToggle = useCallback(() => {
    handleNodeDataUpdateWithSyncDraft({ id, data: { isEditing: !data.isEditing } })
  }, [id, data.isEditing, handleNodeDataUpdateWithSyncDraft])

  // Handle click outside of editor to exit edit mode
  useClickAway(() => {
    if (data.isEditing) {
      handleNodeDataUpdateWithSyncDraft({ id, data: { isEditing: false } })
    }
    handleNodeDataUpdateWithSyncDraft({ id, data: { selected: false } })
  }, ref)

  return (
    <div
      className={cn(
        'flex flex-col relative rounded-md shadow-xs border hover:shadow-md',
        THEME_MAP[theme].bg,
        data.selected ? THEME_MAP[theme].border : 'border-black/5',
      )}
      style={{
        width: data.width,
        height: data.height,
      }}
      ref={ref}
    >
      <NoteEditorContextProvider
        key={controlPromptEditorRerenderKey}
        value={data.text}
      >
        <>
          <NodeResizer
            nodeId={id}
            nodeData={data}
            icon={<Icon />}
            minWidth={240}
            minHeight={88}
          />
          <div className={cn(
            'shrink-0 h-8 opacity-50 rounded-t-md flex items-center px-3',
            THEME_MAP[theme].title,
          )}>
            <div className="text-xs text-gray-500">Markdown Note</div>
          </div>
          {
            data.selected && (
              <div className='absolute top-[-41px] left-1/2 -translate-x-1/2'>
                <NoteEditorToolbar
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  onCopy={handleNodesCopy}
                  onDuplicate={handleNodesDuplicate}
                  onDelete={handleDeleteNode}
                  showAuthor={data.showAuthor}
                  onShowAuthorChange={handleShowAuthorChange}
                  isEditing={data.isEditing}
                  onEditingChange={handleEditToggle}
                />
              </div>
            )
          }
          <div className='grow px-3 py-2.5 overflow-y-auto'>
            <div className={cn(
              'h-full flex flex-col',
              data.selected && data.isEditing && 'nodrag nopan nowheel cursor-text',
            )}>
              {data.isEditing ? (
                <NoteEditor
                  containerElement={ref.current}
                  placeholder={t('workflow.nodes.note.editor.placeholder') || ''}
                  onChange={handleEditorChange}
                  value={data.text}
                />
              ) : (
                <div className="relative markdown-body prose prose-sm max-w-none prose-headings:mt-0 prose-headings:mb-3 prose-p:my-2 prose-p:leading-normal prose-pre:my-2 prose-ul:my-2 prose-ul:leading-normal">
                  <Markdown content={getMarkdownContent(data.text || '')} />
                </div>
              )}
            </div>
          </div>
          {
            data.showAuthor && (
              <div className='p-3 pt-0 text-xs text-text-tertiary'>
                {data.author}
              </div>
            )
          }
        </>
      </NoteEditorContextProvider>
    </div>
  )
}

export default memo(NoteNode)
