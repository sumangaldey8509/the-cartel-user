import { UserInterface } from "@/type/user.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface AuthState {
    isAuthenticated: boolean;
    user: UserInterface | null;
    accessToken: string | null;
    refreshToken: string | null;

}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signin(state, action: PayloadAction<{ user: UserInterface }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = null;
            state.refreshToken = action.payload.user.refreshToken

        },
        updateUser(state, action: PayloadAction<{ user: UserInterface }>) {
            console.log(action.payload.user)
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = null;
            state.refreshToken = action.payload.user.refreshToken
        },
        signout(state) {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false
        }
    }
})

export const { signin, updateUser, signout, } = authSlice.actions;

export default authSlice.reducer;