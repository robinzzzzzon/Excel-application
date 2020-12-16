import {
  CHANGE_TEXT,
  CHANGE_STYLES,
  TABLE_RESIZE,
  APPLY_STYLE,
  CHANGE_TITLE
} from './types'

//функция создания action tableResize
export function tableResize(data) {
  return {
    type: TABLE_RESIZE,
    data
  }
}

//функция создания action changeText
export function changeText(data) {
  return {
    type: CHANGE_TEXT,
    data
  }
}

//функция создания action changeStyles
export function changeStyles(data) {
  return {
    type: CHANGE_STYLES,
    data
  }
}

export function applyStyle(data) {
  return {
    type: APPLY_STYLE,
    data
  }
}

export function changeTitle(data) {
  return {
    type: CHANGE_TITLE,
    data
  }
}
