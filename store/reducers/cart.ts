import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductStoreType } from 'types';

interface CartTypes {
  cartItems: ProductStoreType[]
  cartSuccess: boolean
  cartTotal: number
}

const initialState = { 
  cartItems: [],
  cartSuccess: false,
  cartTotal: 0,
  
} as CartTypes;

const indexSameProduct = (state: CartTypes, action: ProductStoreType) => {
  const sameProduct = (product: ProductStoreType) => (
    product.id === action.id && 
    product.color === action.color && 
    product.size === action.size
  );

  return state.cartItems.findIndex(sameProduct)
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSuccessCart: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        cartSuccess: action.payload
      };
    },
    setCountCart: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        cartTotal: action.payload
      };
    },
    removeProduct(state, action: PayloadAction<ProductStoreType>) {
      // find index of product
      state.cartItems.splice(indexSameProduct(state, action.payload), 1);
    },
    setCount(state, action: PayloadAction<any>) {
      // find index and add new count on product count
      const indexItem = indexSameProduct(state, action.payload.product);
      state.cartItems[indexItem].count = action.payload.count;
    },
    resetCart() {
      return initialState;
    }

  },
})
export const {setCountCart, setSuccessCart, removeProduct, setCount, resetCart } = cartSlice.actions
export default cartSlice.reducer