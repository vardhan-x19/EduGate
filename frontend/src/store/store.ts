import { configureStore, createSlice } from '@reduxjs/toolkit';
import userLoginSlice from './userLogin';

const store = configureStore({
    reducer: {
        user: userLoginSlice.reducer, 
    },
});


export default store;