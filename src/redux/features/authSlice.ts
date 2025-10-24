import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  selectedField: string
  selectedState: string
  lgas: string[]
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  selectedField: '',
  selectedState: '',
  lgas: [],
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedField: (state, action: PayloadAction<string>) => {
      state.selectedField = action.payload
    },
    setSelectedState: (state, action: PayloadAction<string>) => {
      state.selectedState = action.payload
    },
    setLgas: (state, action: PayloadAction<string[]>) => {
      state.lgas = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.selectedField = ''
      state.selectedState = ''
      state.lgas = []
    },
  },
})

export const {
  setSelectedField,
  setSelectedState,
  setLgas,
  setLoading,
  setError,
  logout,
} = authSlice.actions

export default authSlice.reducer
