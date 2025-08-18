import { cloneTemplate, ensureElement } from '../utils/utils';
import { SELECTORS, CURRENCY } from '../utils/constants';
import { formatPrice } from '../utils/helpers';
import type { TProductCart } from '../types';

export class CartItem {
	element: HTMLLIElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	deleteBtn: HTMLButtonElement;

	constructor(
		item: TProductCart,
		index: number,
		onRemove: (id: string) => void
	) {
		this.element = cloneTemplate<HTMLLIElement>(SELECTORS.tpl.cardBasket);

		this.index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.element
		);
		this.title = ensureElement<HTMLElement>('.card__title', this.element);
		this.price = ensureElement<HTMLElement>('.card__price', this.element);
		this.deleteBtn = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.element
		);

		this.render(item, index);
		this.deleteBtn.addEventListener('click', () => onRemove(item._id));
	}

	render(item: TProductCart, index: number) {
		this.index.textContent = String(index);
		this.title.textContent = item.title;
		this.price.textContent = formatPrice(item.price ?? 0, CURRENCY);
		this.element.dataset.id = item._id;
	}
}
