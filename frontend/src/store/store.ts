import { configureStore, createSlice } from '@reduxjs/toolkit';
import quizSlice from './quizz';
// import userLoginSlice from './userLogin';
import userProfileSlice from './user';
const store = configureStore({
    reducer: {
        // user: userLoginSlice.reducer,
        quizzes: quizSlice.reducer,
        user: userProfileSlice.reducer,
    },
});


export default store;