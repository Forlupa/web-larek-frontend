import { handlePrice } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ICard } from '../../types';


export interface IBasketView {
  list: HTMLElement[];
  totalPrice: number;
}


export class Basket extends Component<IBasketView> {
  
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents) {
    super(container);

    this.button = container.querySelector(`.${blockName}__button`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._list = container.querySelector(`.${blockName}__list`);

    if (this.button) {
      this.button.addEventListener('click', () => this.events.emit('basket:order'))
    }
  }

  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    if (items.length) {
      this.setDisabled(this.button, false);
    } else {
      this.setDisabled(this.button, true);
  }
  }

  set totalPrice(price: number) {
    this._price.textContent = handlePrice(price) + ' синапсов';
  }

  updateIndexes() {
    Array.from(this._list.children).forEach(
      (item, index) =>
      (item.querySelector(`.basket__item-index`)!.textContent = (
        index + 1
      ).toString())
    );
  }
 
  disableButton() {
    this.button.disabled = true
  }
}

export interface IBasketItem extends ICard {
  id: string;
  index: number;
}

export interface IBasketItemActions {
  onClick: (event: MouseEvent) => void;
}

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: IBasketItemActions) {
    super(container);

    this._title = container.querySelector(`.${blockName}__title`);
    this._index = container.querySelector(`.basket__item-index`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._button = container.querySelector(`.${blockName}__button`);

    if (this._button) {
      this._button.addEventListener('click', (evt) => {
        this.container.remove();
        actions?.onClick(evt);
      });
    }
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set index(value: number) {
    this._index.textContent = value.toString();
  }

  set price(value: number) {
    this._price.textContent = handlePrice(value) + ' синапсов';
  }
}