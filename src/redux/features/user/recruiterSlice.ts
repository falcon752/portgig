import { AuthStorage, RecruiterAuth } from '@/src/lib/requests/auth.new'
import { RecruiterProfile } from '@/types/recruiter'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface RecruiterState {
  recruiterProfile: RecruiterProfile | null
  loading: boolean
  error: string | null
}

const initialState: RecruiterState = {
  recruiterProfile: null,
  loading: false,
  error: null,
}

export const fetchRecruiterProfile = createAsyncThunk<
  RecruiterProfile,
  string | undefined,
  { rejectValue: string }
>('recruiter/fetchProfile', async (userId, { rejectWithValue }) => {
  try {
    const userIdToUse = userId || AuthStorage.getUserId();
    
    if (!userIdToUse) {
      return rejectWithValue('User ID not found. Please login again.');
    }

    const response = await RecruiterAuth.getProfile(userIdToUse);

    if (response.message === 'Success' || response.message === 'success') {
      return response.data || response.profile;
    }
    
    return rejectWithValue(response.message || 'Failed to fetch profile');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typedError = error as any;
    
    if (typedError.response?.status === 401 || typedError.message?.includes('Unauthorize')) {
      AuthStorage.clearAuth();
      window.location.href = '/login';
      return rejectWithValue('Session expired, please login again');
    }

    console.error('Error fetching recruiter profile:', typedError);
    return rejectWithValue(
      typedError.message || 'An error occurred while fetching the profile'
    );
  }
});

const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState,
  reducers: {
    setRecruiterProfile: (state, action: PayloadAction<RecruiterProfile>) => {
      state.recruiterProfile = action.payload;
    },
    clearProfile: (state) => {
      state.recruiterProfile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruiterProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRecruiterProfile.fulfilled,
        (state, action: PayloadAction<RecruiterProfile>) => {
          state.loading = false;
          state.recruiterProfile = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchRecruiterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setRecruiterProfile, clearProfile } = recruiterSlice.actions;
export default recruiterSlice.reducer;