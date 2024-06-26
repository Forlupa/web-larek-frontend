import { handlePrice } from '../utils/utils';
import { Component } from './base/Component';

export interface ISuccess {
  bill: number;
}

interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _bill: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this._button = container.querySelector(`.${blockName}__close`);
    this._bill = container.querySelector(`.${blockName}__description`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  set bill(value: number) {
    this.setText(this._bill, 'Списано ' + handlePrice(value) + ' синапсов')
  }
}