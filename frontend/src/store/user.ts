import {createSlice} from '@reduxjs/toolkit';
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    isLoggedIn: false,
    token: null,
    user: {
      id: null,
      name: '',
      email: '',
      role: '',
    },
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    register: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = { id: null, name: '', email: '', role: '' };
    },
  },
});

export const { login, logout, register } = userProfileSlice.actions;
export default userProfileSlice;