# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс StoreData
Класс отвечает за хранение и логику работы с данными приложения.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
-  `basket: ICard[]` - корзина с товарами
-  `cards: ICard[]` - массив товаров
-  `order: IOrder` - информация о заказе
-  `formErrors: FormErrors` - ошибки формы
-  `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными:
-  `addToBasket(card: ICard): void` - добавляет товар в корзину
-  `deleteFromBasket(cardId: string): void` - удаляет товар из корзины
-  `clearBasket(): void` - очищает корзину целиком
-  `getBasketLength(): number` - возвращяет количество товаров в корзине
-  `getTotalPrice(): number` - возвращает общую стоимость товаров в корзине
-  `setOrderForm(field: keyof TOrderInfo, value: string): void` - заполняет поля формы
-  `checkOrderValidation(data: Record<keyof TOrderForm, string>): boolean` - валидирует форму заказа
-  `checkContactsValidation(data: Record<keyof TContactsForm, string>): boolean` - валидирует форму контактов
-  `clearOrder(): boolean` - сбрасывает заказ после покупки


## Данные и типы данных используемые в приложении

Тип для всех возможных категорий

```
export type CategoryType =
   'софт-скил'
  | 'другое'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';
```

Интерфейс карточки товара

```
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}
```

Интерфейс заказа

```
export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

Интерфейс данных приложения

```
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
```

Тип для формы заказа

```
export type TOrderForm = Pick<IOrder, "payment" | "email" | "phone" | "address">
```