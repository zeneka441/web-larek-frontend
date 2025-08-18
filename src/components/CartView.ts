import { cloneTemplate, ensureElement } from '../utils/utils';
import { SELECTORS, CURRENCY } from '../utils/constants';
import type { TProductCart } from '../types';
import { CartItem } from './CartItem';

export class CartView {
	element = cloneTemplate<HTMLElement>(SELECTORS.tpl.basket);
	list = ensureElement<HTMLUListElement>('.basket__list', this.element);
	totalEl = ensureElement<HTMLSpanElement>(
		'.basket__price',
		this.element
	);
	checkoutBtn = ensureElement<HTMLButtonElement>(
		'.basket__button',
		this.element
	);

	render(
		items: TProductCart[],
		total: number,
		onRemove: (id: string) => void,
		onCheckout: () => void
	) {
		this.list.replaceChildren(
			...items.map((it, idx) => new CartItem(it, idx + 1, onRemove).element)
		);

		this.totalEl.textContent = `${total} ${CURRENCY}`;
		this.checkoutBtn.onclick = onCheckout;
		this.checkoutBtn.disabled = items.length === 0;
	}
}
