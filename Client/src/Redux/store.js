import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({
    user: userReducer
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
    }
})

export const persistor = persistStore(store);