import { remove } from 'lodash';

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypeUser } from 'types';


type ToggleFavType = {
  id: string;
}

interface UserSliceTypes {
  user: any;
  favProducts: any;
}

const initialState = {
  user: null,
  favProducts: [],
} as UserSliceTypes

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleFavProduct(state, action: PayloadAction<ToggleFavType>) {
      const index = state.favProducts.includes(action.payload.id);
      if(!index) {
        state.favProducts.push(action.payload.id);
        return;
      }
      remove(state.favProducts, id => id === action.payload.id);
    },
    setUserLogged(state, action: PayloadAction<TypeUser | null>) {
        return {
          ...state,
          user: action.payload
        };
    },
    resetUser() {
      return initialState;
    }
  },
})

export const { toggleFavProduct, setUserLogged, resetUser } = userSlice.actions
export default userSlice.reducer