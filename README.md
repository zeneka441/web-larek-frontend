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
- src/scss/styles.scss — корневой файл стилей
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

## Данные и типы данных, используемые в приложении

### Интерфейсы

#### ICard
Интерфейс карточки товара, описывающий основную информацию о продукте в каталоге.

```
export interface ICard {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

#### IForm
Интерфейс формы заказа, содержащий информацию о способе оплаты, адресе доставки и контактных данных покупателя.

```
export interface IForm {
  paymentType: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  items: ICard[];
}
```

#### ICardsList
Интерфейс списка карточек товаров с возможностью просмотра карточки товара.

```
export interface ICardsList {
  cards: ICard[];
  preview: string | null;
}
```

### Типы

#### TProductThumbnail
Тип для отображения товара в виде миниатюры в каталоге. Содержит только необходимые поля для карточки товара.

```
export type TProductThumbnail = Pick<ICard, '_id' | 'category' | 'title' | 'image' | 'price'>;
```

#### TProductCart
Тип для отображения товара в корзине. Содержит минимальную информацию, необходимую для корзины покупок.

```
export type TProductCart = Pick<ICard, '_id' | 'title' | 'price'>;
```

#### TPayment
Тип для данных о способе оплаты и адресе доставки, используемый на первом этапе оформления заказа.

```
export type TPayment = Pick<IForm, 'paymentType' | 'address'>;
```

#### TContact
Тип для контактных данных покупателя, используемый на втором этапе оформления заказа.

```
export type TContact = Pick<IForm, 'email' | 'phone'>;
```
