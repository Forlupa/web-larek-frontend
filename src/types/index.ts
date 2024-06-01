export type CategoryType =
  | 'софт-скил'
  | 'другое'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

  export type CategoryList = {
    [Key in CategoryType]: string;
  };

  export interface ApiResponse {
    items: ICard[];
  };
  

export type FormErrors = Partial<Record<keyof TOrderInfo, string>>;  

export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}


export interface IStoreData {
  basket: ICard[];
  cards: ICard[];
  order: IOrder;
  formErrors: FormErrors;
  addToBasket(card: ICard): void;
  deleteFromBasket(cardId: string): void;
  clearBasket(): void;
  getBasketLength(): number;
  getTotalPrice(): number;
  setOrderForm(field: keyof TOrderInfo, value: string): void;
  checkOrderValidation(data: Record<keyof TOrderForm, string>): boolean;
  checkContactsValidation(data: Record<keyof TContactsForm, string>): boolean;
  clearOrder(): boolean;
}



export type TOrderInfo = Pick<IOrder, "payment" | "email" | "phone" | "address">;
export type TOrderForm = Pick<IOrder, "payment" | "address">;
export type TContactsForm = Pick<IOrder, "email" | "phone" >