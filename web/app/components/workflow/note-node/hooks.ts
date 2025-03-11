import { useCallback } from 'react'
import { WorkflowHistoryEvent, useNodeDataUpdate, useWorkflowHistory } from '../hooks'
import { NoteTheme } from './types'

export const useNote = (id: string) => {
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()
  const { saveStateToHistory } = useWorkflowHistory()

  const handleThemeChange = useCallback((theme: NoteTheme) => {
    handleNodeDataUpdateWithSyncDraft({ id, data: { theme } })
    saveStateToHistory(WorkflowHistoryEvent.NoteChange)
  }, [handleNodeDataUpdateWithSyncDraft, id, saveStateToHistory])

  const handleEditorChange = useCallback((text: string) => {
    // If the text is a JSON string (from Lexical editor), extract the plain text
    try {
      const parsed = JSON.parse(text)
      if (parsed.root?.children) {
        const plainText = parsed.root.children
          .map((node: any) => {
            if (node.type === 'paragraph' && node.children) {
              return node.children
                .map((child: any) => child.text || '')
                .join('')
            }
            return ''
          })
          .join('\n')
        handleNodeDataUpdateWithSyncDraft({ id, data: { text: plainText } })
      } else {
        handleNodeDataUpdateWithSyncDraft({ id, data: { text } })
      }
    } catch {
      // If not JSON, save as is
      handleNodeDataUpdateWithSyncDraft({ id, data: { text } })
    }
    saveStateToHistory(WorkflowHistoryEvent.NoteChange)
  }, [handleNodeDataUpdateWithSyncDraft, id, saveStateToHistory])

  const handleShowAuthorChange = useCallback((showAuthor: boolean) => {
    handleNodeDataUpdateWithSyncDraft({ id, data: { showAuthor } })
    saveStateToHistory(WorkflowHistoryEvent.NoteChange)
  }, [handleNodeDataUpdateWithSyncDraft, id, saveStateToHistory])

  return {
    handleThemeChange,
    handleEditorChange,
    handleShowAuthorChange,
  }
}

// Add default values for new note nodes
export const getDefaultNoteData = () => ({
  text: '',
  theme: NoteTheme.blue,
  author: '',
  showAuthor: false,
  isEditing: true, // Default to edit mode for new nodes
})
