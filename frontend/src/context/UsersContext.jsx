import { createContext, useReducer } from 'react'

export const UsersContext = createContext()

export const usersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        userlgs: action.payload
      }
    case 'CREATE_USER':
      return {
        userlgs: [action.payload, ...state.userlgs]
      }
    case 'DELETE_USER':
      return {
        userlgs: state.userlgs.filter((u) => u._id !== action.payload._id)
      }
    case 'UPDATE_USER':
      return {
        userlgs: state.userlgs.map((userlg) =>
          userlg._id === action.payload._id ? action.payload : userlg
        )
      }
    default:
      return state
  }
}

export const UsersContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, {
    userlgs: []
  })

  return (
    <UsersContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UsersContext.Provider>
  )
}