import { describe, test, expect } from 'vitest'
import formReducer, { addFormData, markAsNotNew, clearAllNewFlags } from '../src/store/formSlice'
import type { FormData } from '../src/store/formSlice'

describe('form slice', () => {
  const initialState = {
    submissions: [],
  }

  const mockFormData: Omit<FormData, 'id' | 'isNew'> = {
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    gender: 'male',
    terms: true,
    image: 'base64string',
    country: 'USA',
    timestamp: '2023-01-01T00:00:00.000Z',
  }

  test('should handle initial state', () => {
    expect(formReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  test('should handle addFormData', () => {
    const action = addFormData(mockFormData)
    const state = formReducer(initialState, action)

    expect(state.submissions).toHaveLength(1)
    expect(state.submissions[0]).toMatchObject({
      ...mockFormData,
      isNew: true,
    })
    expect(state.submissions[0].id).toBeDefined()
  })

  test('should handle markAsNotNew', () => {
    const addAction = addFormData(mockFormData)
    let state = formReducer(initialState, addAction)
    const submissionId = state.submissions[0].id

    const markAction = markAsNotNew(submissionId)
    state = formReducer(state, markAction)

    expect(state.submissions[0].isNew).toBe(false)
  })

  test('should handle clearAllNewFlags', () => {
    const addAction = addFormData(mockFormData)
    let state = formReducer(initialState, addAction)

    const clearAction = clearAllNewFlags()
    state = formReducer(state, clearAction)

    expect(state.submissions[0].isNew).toBe(false)
  })
})