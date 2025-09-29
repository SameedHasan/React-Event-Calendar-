import { configureStore } from '@reduxjs/toolkit'
import calendarSlice from './calendarSlice'

const Store = configureStore({
    reducer: {
        calendar: calendarSlice,
    }
})

export default Store