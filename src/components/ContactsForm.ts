import { IEvents } from './base/Events';
import { Form } from './common/Form';
import { TContactsForm } from '../types/index';

export class ContactsForm extends Form<TContactsForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}