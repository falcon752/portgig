// import AuthStorage from '@/src/lib/requests/auth.new'
// // import { RecruiterJobs } from '@/src/lib/requests/jobs'
// import { RecruiterJobsResponse } from '@/types/recruiter'
// import type { PayloadAction } from '@reduxjs/toolkit'
// import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

// // Define the initial state
// interface JobState {
//   jobs: RecruiterJobsResponse | null
//   loading: boolean
//   error: string | null
// }

// const initialState: JobState = {
//   jobs: null,
//   loading: false,
//   error: null,
// }

// /* Fetch jobs for recruiter */
// export const fetchRecruiterJobs = createAsyncThunk(
//   'recruiterJobs/fetchRecruiterJobs',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await RecruiterJobs.getCreators()

//       if (response?.status === 200) {
//         return response as RecruiterJobsResponse
//       }

//       return rejectWithValue(
//         response.message || 'Failed to fetch recruiter jobs'
//       )
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const typedError = error as any
//       if (typedError.response?.status === 401) {
//         AuthStorage.clearAuth()
//         window.location.href = '/login'
//         return rejectWithValue('Session expired, please login again')
//       }

//       return rejectWithValue('An error occurred while fetching recruiter jobs')
//     }
//   }
// )

// // Create the slice
// const recruiterJobSlice = createSlice({
//   name: 'recruiterJobs',
//   initialState,
//   reducers: {
//     setRecruiterJobs: (state, action: PayloadAction<RecruiterJobsResponse>) => {
//       state.jobs = action.payload
//     },
//     clearRecruiterJobs: (state) => {
//       state.jobs = null
//       state.error = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchRecruiterJobs.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
//         state.loading = false
//         state.jobs = action.payload
//         state.error = null
//       })
//       .addCase(fetchRecruiterJobs.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   },
// })

// // Export actions and reducer
// export const { setRecruiterJobs, clearRecruiterJobs } =
//   recruiterJobSlice.actions
// export default recruiterJobSlice.reducer

// // Export loading state selector
// export const selectRecruiterJobsLoading = createSelector(
//   (state: { recruiterJobs: JobState }) => state.recruiterJobs.loading,
//   (loading) => loading
// )
