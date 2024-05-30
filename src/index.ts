import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api, ApiListResponse } from './components/base/Api';
import { AppState, Product, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { CatalogItem, CatalogItemPreview } from './components/Card';
import { Basket, BasketItem } from './components/Basket';
import { Modal } from './components/common/Modal';
import { ensureElement, cloneTemplate } from './utils/utils';
import { TOrderForm, TContactsForm, TOrderInfo, ICard, ApiResponse } from './types';
import { API_URL } from './utils/constants';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Succsess';

const api = new Api(API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new OrderForm('order', cloneTemplate(orderTemplate), events)
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close')
    modal.close()
  }
})

// Получаем лоты с сервера
api
  .get('/product')
  .then((res: ApiResponse) => {
    appData.setCatalog(res.items as ICard[]);
  })
  .catch((err) => {
    console.error(err);
  });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.cards.map(item => {
      const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card:select', item)
      });
      return card.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price,
      });
  });
});

// Открыть превью карточки
events.on('card:select', (item: Product) => {
  page.locked = true;
  const product = new CatalogItemPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('card:toBasket', item)
    },
  });
  modal.render({
    content: product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      selected: item.selected
    }),
  });
});

// Закрытие модального окна
events.on('modal:close', () => {
  page.locked = false;
});

// Добавить товар в корзину
events.on('card:toBasket', (item: Product) => {
  item.selected = true;
  appData.addToBasket(item);
  page.counter = appData.getBasketLength();
  modal.close();
})

// Открыть корзину
events.on('basket:open', () => {
  page.locked = true
  const basketItems = appData.basket.map((item, index) => {
    const basketItem = new BasketItem(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit('basket:delete', item)
      }
    );
    return basketItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  modal.render({
    content: basket.render({
      list: basketItems,
      totalPrice: appData.getTotalPrice(),
    }),
  });
});

// Удалить товар из корзины
events.on('basket:delete', (item: Product) => {
  appData.deleteFromBasket(item.id);
  item.selected = false;
  basket.totalPrice = appData.getTotalPrice();
  page.counter = appData.getBasketLength();
  basket.updateIndexes();
  if (appData.basket.length === 0) {
    basket.toggleButton(true);
  }
})

// Перейти к оформлению заказа
events.on('basket:order', () => {
  modal.render({
    content: order.render(
      {
        valid: false,
        errors: []
      }
    ),
  });
});

// Изменить состояние валидации окошка заказа
events.on('orderFormErrors:change', (errors: Partial<TOrderForm>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Изменились введенные данные
events.on(/^order\..*:change/, (data: { field: keyof TOrderInfo, value: string }) => {
  appData.setOrderForm(data.field, data.value);
});

// Перейти к окну с контактами
events.on('order:submit', () => {
  appData.order.total = appData.getTotalPrice()
  appData.setItems();
  modal.render({
    content: contacts.render(
      {
        valid: false,
        errors: []
      }
    ),
  });
});

// Изменить состояние валидации окошка контактов
events.on('contactsFormErrors:change', (errors: Partial<TContactsForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Изменились введенные данные
events.on(/^contacts\..*:change/, (data: { field: keyof TOrderInfo, value: string }) => {
  appData.setOrderForm(data.field, data.value);
});


// Оформить заказ
events.on('contacts:submit', () => {
  api.post('/order', appData.order)
    .then((res) => {
      events.emit('order:success', res);
      appData.clearBasket();
      appData.clearOrder();
      page.counter = 0;
    })
    .catch((err) => {
      console.log(err)
    })
})

// Окно успешной покупки
events.on('order:success', (res: ApiListResponse<string>) => {
  modal.render({
    content: success.render({
      bill: res.total
    })
  })
})