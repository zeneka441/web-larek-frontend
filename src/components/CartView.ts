import { cloneTemplate, ensureElement } from '../utils/utils';
import { SELECTORS, CURRENCY } from '../utils/constants';
import type { TProductCart } from '../types';
import { formatPrice } from '../utils/helpers';

export class CartView {
	element = cloneTemplate<HTMLElement>(SELECTORS.tpl.basket);
	private list = ensureElement<HTMLUListElement>('.basket__list', this.element);
	private totalEl = ensureElement<HTMLSpanElement>(
		'.basket__price',
		this.element
	);
	private checkoutBtn = ensureElement<HTMLButtonElement>(
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
			...items.map((it, idx) => {
				const li = cloneTemplate<HTMLLIElement>(SELECTORS.tpl.cardBasket);
				li.querySelector('.basket__item-index')!.textContent = String(idx + 1);
				li.querySelector('.card__title')!.textContent = it.title;
				li.querySelector('.card__price')!.textContent = formatPrice(
					it.price ?? 0,
					CURRENCY
				);
				const del = li.querySelector<HTMLButtonElement>(
					'.basket__item-delete'
				)!;
				del.addEventListener('click', () => onRemove(it._id));
				return li;
			})
		);
		this.totalEl.textContent = `${total} ${CURRENCY}`;
		this.checkoutBtn.onclick = onCheckout;
		this.checkoutBtn.disabled = items.length === 0;
	}
}
