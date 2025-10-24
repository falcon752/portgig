import { AuthStorage, CreatorAuth } from "@/src/lib/requests/auth.new";
import { UserProfile, UserResponse } from "@/types/user"; 
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  string | undefined,
  { rejectValue: string }
>("user/fetchProfile", async (userId, { rejectWithValue }) => {
  try {
    const userIdToUse = userId || AuthStorage.getUserId();

    if (!userIdToUse) {
      return rejectWithValue("User ID not found. Please login again.");
    }

    const response: UserResponse = await CreatorAuth.getProfile(userIdToUse);

    if (response.message === "success" || response.message === "Success") {
      const profileData = response.data || response.profile;

      if (!profileData) {
        return rejectWithValue("Profile data not found in response");
      }

      return profileData as UserProfile;
    }

    return rejectWithValue(response.message || "Failed to fetch profile");
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typedError = error as any;

    if (
      typedError.response?.status === 401 ||
      typedError.message?.includes("Unauthorize")
    ) {
      AuthStorage.clearAuth();
      window.location.href = "/login";
      return rejectWithValue("Session expired, please login again");
    }

    console.error("Error fetching user profile:", typedError);
    return rejectWithValue(
      typedError.message || "An error occurred while fetching the profile"
    );
  }
});

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
