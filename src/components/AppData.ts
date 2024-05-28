import { IOrder, TOrderInfo, ICard, FormErrors, TOrderForm } from '../types';
import { Model } from './base/Model';
import { IStoreData } from '../types';

export type CatalogChangeEvent = {
  catalog: Product[]
};

export class Product extends Model<ICard> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

/*
  * Класс, описывающий состояние приложения
  * */
export class AppState extends Model<IStoreData> {
  basket: Product[] = [];

  cards: Product[];

  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };

  formErrors: FormErrors = {};

  addToBasket(value: Product) {
    this.basket.push(value);
  }

  deleteFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id)
  }

  clearBasket() {
    this.basket.length = 0;
  }

  getBasketLength() {
    return this.basket.length;
  }

  setOrderForm(field: keyof TOrderInfo, value: string) {
    this.order[field] = value;

    if (this.checkContactsValidation()) {
      this.events.emit('contacts:ready', this.order)
    }
    if (this.checkOrderValidation()) {
      this.events.emit('order:ready', this.order);
    }
  }

  setItems() {
    this.order.items = this.basket.map(item => item.id)
  }

  setCatalog(items: ICard[]) {
    this.cards = items.map((item) => new Product({ ...item, selected: false }, this.events));
    this.emitChanges('items:changed', { store: this.cards });
  }

  checkContactsValidation() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  checkOrderValidation() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearOrder() {
    this.order = {
      items: [],
      total: null,
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
  }

  getTotalPrice() {
    return this.basket.reduce((a, b) => a + b.price, 0);
  }


}