'use client'

import {
  memo,
  useCallback,
} from 'react'
import { useWorkflowHistoryStore } from '../../workflow-history-store'
import dynamic from 'next/dynamic'

// Dynamically import Monaco editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

type EditorProps = {
  placeholder?: string
  onChange?: (value: string) => void
  value?: string
  containerElement: HTMLDivElement | null
}

const Editor = ({
  placeholder = 'Write your markdown note...',
  onChange,
  value = '',
  containerElement,
}: EditorProps) => {
  const { setShortcutsEnabled } = useWorkflowHistoryStore()

  const handleEditorChange = useCallback((value: string | undefined) => {
    onChange?.(value || '')
  }, [onChange])

  return (
    <div className='relative h-full min-h-[200px] grow bg-white/50 rounded'>
      <MonacoEditor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={handleEditorChange}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme('markdown-light', {
            base: 'vs',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: '569CD6' },
              { token: 'type', foreground: '4EC9B0' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'number', foreground: 'B5CEA8' },
              { token: 'comment', foreground: '6A9955' },
            ],
            colors: {
              'editor.background': '#ffffff10',
              'editor.foreground': '#000000',
              'editorCursor.foreground': '#000000',
              'editor.lineHighlightBackground': '#ffffff20',
              'editorLineNumber.foreground': '#237893',
              'editor.selectionBackground': '#ADD6FF80',
              'editor.inactiveSelectionBackground': '#E5EBF1',
            },
          })
        }}
        onMount={(editor) => {
          editor.updateOptions({ theme: 'markdown-light' })
          editor.setValue(value || '') // Set initial value
          editor.onDidFocusEditorText(() => setShortcutsEnabled(false))
          editor.onDidBlurEditorText(() => setShortcutsEnabled(true))

          // Force layout update after mount
          setTimeout(() => {
            editor.layout()
          }, 100)
        }}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'off',
          wordWrap: 'on',
          wrappingIndent: 'same',
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          glyphMargin: false,
          folding: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          fontSize: 14,
          renderLineHighlight: 'none',
          contextmenu: false,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: 'off',
          tabSize: 2,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  )
}

export default memo(Editor)
