export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  address: Address | null;
};

export type Address = {
  id: number;
  city: string;
  country: string;
  street: string;
  houseNumber: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  seller: User;
  category: Category;
};

export type Category = {
  id: number;
  name: string;
  parentCategory: Category | null;
};

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: number;
  placedAt: Date;
  user: User;
  status: string;
  totalPrice: number;
  shippingAddress: Address;
  items: OrderItem[];
};

export type Result<T> =
  | {
      isSuccess: true;
      content: T;
    }
  | {
      isSuccess: false;
      errMessage: string;
    };
