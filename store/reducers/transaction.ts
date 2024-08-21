import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface TransactionTypes {
  transactionList: any
}

const initialState = { 
  transactionList: []
  
} as TransactionTypes;


const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setSuccessTransaction: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        transactionList: action.payload
      };
    },
    resetTransaction() {
      return initialState;
    }
  },
 
})
export const {setSuccessTransaction, resetTransaction } = transactionSlice.actions
export default transactionSlice.reducer