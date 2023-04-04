import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentVideoId: undefined,
};

const videoSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
        videoSelected: (state, action) => {
            state.currentVideoId = action.payload;
        },
    },
});

export const { videoSelected } = videoSlice.actions;
export default videoSlice.reducer;
