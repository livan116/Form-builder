import { configureStore } from '@reduxjs/toolkit'
import formReducer from './slices/formSlice'
import uiReducer from './slices/uiSlice'
import responsesReducer from './slices/responsesSlice'
import historyReducer from './slices/historySlice'

export const store = configureStore({
  reducer: {
    form: formReducer,
    ui: uiReducer,
    responses: responsesReducer,
    history: historyReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in these paths
        ignoredPaths: ['history.past', 'history.future'],
      },
    }),
})