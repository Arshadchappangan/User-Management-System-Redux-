import { createSlice } from "@reduxjs/toolkit";


const INITIAL_STATE = {
    name : null,
    email : null,
    role : 'user',
    auth : false,
    id : null,
    token : null,
    profileImage : null
}

const userSlice = createSlice({
    name : 'user',
    initialState : INITIAL_STATE,
    reducers : {
        login : (state,action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.id = action.payload.id;
            state.profileImage = action.payload.profileImage || null;
            state.auth = true;
            state.token = action.payload.token;
        },
        logout : (state) => {
            state.name = null;
            state.email = null;
            state.auth = false;
            state.id = null;
            state.profileImage = null;
        },
        setProfileImage : (state,action) => {
            state.profileImage = action.payload;
        }
    }
})

export const {login,logout,setProfileImage} = userSlice.actions;
export default userSlice.reducer;