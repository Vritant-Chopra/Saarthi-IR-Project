import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    groupedImages: {},
    modifiedData: {},
};

const imageSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        setGroupedImages(state, action) {
            state.groupedImages = action.payload;
        },
        setModifiedData(state, action) {
            state.modifiedData = {
                ...state.modifiedData,
                ...action.payload,
            };
        },
        resetModifiedData(state) {
            state.modifiedData = {};
        },
    },
});

export const { setGroupedImages, setModifiedData, resetModifiedData } = imageSlice.actions;
export default imageSlice.reducer;
