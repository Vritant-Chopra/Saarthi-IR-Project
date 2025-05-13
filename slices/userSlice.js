import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: null,
        email: null,
        mode: null
    },
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.mode = action.payload.mode;
        },
        clearUser: (state) => {
            state.username = null;
            state.email = null;
            state.mode = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
