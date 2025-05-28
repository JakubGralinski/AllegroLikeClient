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

export type Result<T> =
  | {
      success: true;
      content: T;
    }
  | {
      success: false;
      errMessage: string;
    };
