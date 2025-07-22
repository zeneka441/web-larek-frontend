export interface ICard {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IForm {
  paymentType: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  items: ICard[];
}

export interface ICardsList {
  cards: ICard[];
  preview: string | null;
  showCard(cardId: ICard): void;
  getCard(cardId: string): ICard;
}

export interface IBasketModel {
  add(cardId: string): void;
  remove(cardId: string): void;
  getItems(): ICard[];
  getTotal(): number;
  clear(): void;
}

export interface IFormData {
  setPaymentAndAddress(paymentType: 'online' | 'cash', address: string): void;
  setContacts(data: Record<keyof TContact, string>): void;
  clearData(): void;
}

export type TProductThumbnail = Pick<ICard, '_id' | 'category' | 'title' | 'image' | 'price'>;

export type TProductCart = Pick<ICard, '_id' | 'title' | 'price'>;

export type TPayment = Pick<IForm, 'paymentType' | 'address'>;

export type TContact = Pick<IForm, 'email' | 'phone'>;
