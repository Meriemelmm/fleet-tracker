import { configureStore } from '@reduxjs/toolkit';
import camionReducer from '../features/camionSlice'
const store= configureStore({

    reducer:{
        camions:camionReducer

    }
});
export default store;