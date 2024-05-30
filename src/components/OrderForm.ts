import { IEvents } from './base/Events';
import { Form } from './common/Form';
import { TOrderForm } from '../types/index';


export class OrderForm extends Form<TOrderForm> {
  
  protected _cashless: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this._cashless = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add('button_alt-active')
        this._cashless.classList.remove('button_alt-active')
        this.onInputChange('payment', 'cash')
      })
    }
    if (this._cashless) {
      this._cashless.addEventListener('click', () => {
        this._cashless.classList.add('button_alt-active')
        this._cash.classList.remove('button_alt-active')
        this.onInputChange('payment', 'card')
      })
    }
  }

}