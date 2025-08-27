import { configureStore, createSlice } from '@reduxjs/toolkit';
import userLoginSlice from './userLogin';
import userProfileSlice from './user';
const store = configureStore({
    reducer: {
        // user: userLoginSlice.reducer, 
        user: userProfileSlice.reducer,
    },
});


export default store;