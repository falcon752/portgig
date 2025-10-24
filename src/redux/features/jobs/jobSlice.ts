// import AuthStorage from '@/src/lib/requests/auth.new'
// import { JobResponse } from '@/types/jobs'
// import type { PayloadAction } from '@reduxjs/toolkit'
// import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

// // Define the initial state
// interface JobState {
//   jobs: JobResponse | null
//   loading: boolean
//   error: string | null
// }

// const initialState: JobState = {
//   jobs: null,
//   loading: false,
//   error: null,
// }

// /* The `export const fetchJobs` is creating an asynchronous thunk using the `createAsyncThunk`
// function from Redux Toolkit. This thunk is responsible for fetching the job data and handling
// various scenarios such as success, error, and session expiration. */
// export const fetchJobs = createAsyncThunk(
//   'jobs/fetchJobs',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await CreatorJobs.getJobs()

//       if (response?.status === 200) {
//         return response.data
//       }

//       return rejectWithValue(response.message || 'Failed to fetch jobs')
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const typedError = error as any
//       if (typedError.response?.status === 401) {
//         AuthStorage.clearAuth()
//         window.location.href = '/login'
//         return rejectWithValue('Session expired, please login again')
//       }

//       return rejectWithValue('An error occurred while fetching the jobs')
//     }
//   }
// )

// // Create the slice
// const jobSlice = createSlice({
//   name: 'jobs',
//   initialState,
//   reducers: {
//     setJobs: (state, action: PayloadAction<JobResponse>) => {
//       state.jobs = action.payload
//     },
//     clearJobs: (state) => {
//       state.jobs = null
//       state.error = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchJobs.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchJobs.fulfilled, (state, action) => {
//         state.loading = false
//         state.jobs = {
//           status: 200,
//           message: 'Success',
//           data: action.payload!, // Non-null assertion to handle undefined
//         }
//         state.error = null
//       })
//       .addCase(fetchJobs.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   },
// })

// // Export actions and reducer
// export const { setJobs, clearJobs } = jobSlice.actions
// export default jobSlice.reducer

// // Export loading state selector
// export const selectLoading = createSelector(
//   (state: { jobs: JobState }) => state.jobs.loading,
//   (loading) => loading
// )
