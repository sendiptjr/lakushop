export type VotesType = {
  count: number;
  value: number;
};

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[];
};

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
};

export type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
  images: string[];
  discount?: string;
  currentPrice: number;
  punctuation: PunctuationType;
  reviews: ReviewType[];
};

export type ProductTypeList = {
  id: string;
  name: string;
  price: string;
  color: string;
  images: string[];
  discount?: string;
  currentPrice?: number;
};

export type ProductStoreType = {
  id: string;
  name: string;
  thumb: string;
  price: number;
  count: number;
  color: string;
  size: string;
};

export type GtagEventType = {
  action: string;
  category: string;
  label: string;
  value: string;
};

export type IReqLogin = {
  username: string;
  password: string;
};
export type IReqLoginResponse = {
  data: {
    customer: {
      ID: number;
      CreatedAt: string;
      UpdatedAt: string;
      DeletedAt: string | null;
      first_name: string;
      last_name: string | null;
      dob: string | null;
      last_update_password_at: string | null;
      email: string;
      email_verified: string;
      phone: string;
      gender: string | null;
      picture: string | null;
      unique_code: string | null;
    };
    status: string | number;
    token: string;
  };
  status: number;
};

export type ArrayLinkage = {
  name: string;
  status: boolean;
};
export type TypeUser = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  first_name: string;
  last_name: string | null;
  dob: string | null;
  last_update_password_at: string | null;
  email: string;
  email_verified: string;
  phone: string;
  gender: string | null;
  picture: string | null;
  unique_code: string | null;
  linkage: ArrayLinkage[];
};

export type IReqRegister = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  price: number;
  discount: number;
  current_price: number;
  img_thumbnail: string;
  product_img: {
    id: number;
    product_id: string | null;
    image: string | null;
  };
};

export type CartDetail = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null;
  customer_id: number;
  qty: number;
  product_id: number;
  Product: Product;
};

export type CartResponse = {
  data: {
    data: CartDetail[]
    status: string;
  }
  status: number
};
