import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  theme: 'dark'
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.currentUser = action.payload
    },
    toggleTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})


export const { loggedIn, toggleTheme } = userSlice.actions

export default userSlice.reducer