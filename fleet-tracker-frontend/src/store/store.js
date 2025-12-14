import { configureStore } from '@reduxjs/toolkit';
import camionReducer from '../features/camionSlice'
import remorqueReducer from '../features/remorqueSlice'
const store= configureStore({

    reducer:{
        camions:camionReducer,
        remorques:remorqueReducer

    }
});
export default store;