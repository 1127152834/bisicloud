import { useCallback } from 'react'
import { generateNewNode } from '../utils'
import { useWorkflowStore } from '../store'
import type { NoteNodeType } from '../note-node/types'
import { CUSTOM_NOTE_NODE } from '../note-node/constants'
import { NoteTheme } from '../note-node/types'
import { useAppContext } from '@/context/app-context'
import { getDefaultNoteData } from '../note-node/hooks'

export const useOperator = () => {
  const workflowStore = useWorkflowStore()
  const { userProfile } = useAppContext()

  const handleAddNote = useCallback(() => {
    const defaultData = getDefaultNoteData()
    const { newNode } = generateNewNode({
      type: CUSTOM_NOTE_NODE,
      data: {
        ...defaultData,
        author: userProfile?.name || '',
        width: 240,
        height: 88,
        _isCandidate: true,
      } as NoteNodeType,
      position: {
        x: 0,
        y: 0,
      },
    })
    workflowStore.setState({
      candidateNode: newNode,
    })
  }, [workflowStore, userProfile])

  return {
    handleAddNote,
  }
}
