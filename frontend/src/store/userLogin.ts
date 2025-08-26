import {createSlice} from '@reduxjs/toolkit';
const userLoginSlice = createSlice({
    name: 'userLogin',
    initialState: { isLoggedIn: false, token: null },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
        },
    },
});
export const { login, logout } = userLoginSlice.actions;
export default userLoginSlice;