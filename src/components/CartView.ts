import { cloneTemplate, ensureElement } from '../utils/utils';
import { SELECTORS, CURRENCY } from '../utils/constants';

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
		items: HTMLElement[],
		total: number,
		onCheckout: () => void
	) {
		this.list.replaceChildren(...items);
		this.totalEl.textContent = `${total} ${CURRENCY}`;
		this.checkoutBtn.onclick = onCheckout;
		this.checkoutBtn.disabled = items.length === 0;
	}
}
