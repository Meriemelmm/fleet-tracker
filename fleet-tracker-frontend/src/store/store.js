import { configureStore } from '@reduxjs/toolkit';
import camionReducer from '../features/camionSlice'
import remorqueReducer from '../features/remorqueSlice'
import chauffeurReducer from '../features/chauffeurSlice'
const store= configureStore({

    reducer:{
        camions:camionReducer,
        remorques:remorqueReducer,
        chauffeurs:chauffeurReducer

    }
});
export default store;