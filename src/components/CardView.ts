import type { TProductThumbnail } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { SELECTORS, CURRENCY } from '../utils/constants';
import { formatPrice } from '../utils/helpers';

export class CardView {
	element: HTMLElement;

	constructor(data: TProductThumbnail, onOpen: () => void) {
		this.element = cloneTemplate<HTMLElement>(SELECTORS.tpl.cardCatalog);
		this.patch(data);
		this.element.addEventListener('click', onOpen);
	}

	patch(data: TProductThumbnail) {
		this.element.querySelector('.card__title')!.textContent = data.title;
		this.element.querySelector('.card__category')!.textContent = data.category;
		const price = this.element.querySelector('.card__price')!;
		price.textContent = formatPrice(data.price ?? 0, CURRENCY);
		const img = this.element.querySelector<HTMLImageElement>('.card__image');
		if (img && data.image) img.src = data.image;
	}
}

type PreviewActions =
	| (() => void)
	| { inCart: boolean; onAdd: () => void; onRemove: () => void };

export class CardPreviewView {
	element: HTMLElement;
	private btnAdd: HTMLButtonElement;

	constructor(
		data: TProductThumbnail & { description?: string },
		actions: PreviewActions
	) {
		this.element = cloneTemplate<HTMLElement>(SELECTORS.tpl.cardPreview);

		this.element.querySelector('.card__title')!.textContent = data.title;
		this.element.querySelector('.card__category')!.textContent = data.category;

		const price = this.element.querySelector('.card__price')!;
		price.textContent = formatPrice(data.price ?? 0, CURRENCY);

		const img = this.element.querySelector<HTMLImageElement>('.card__image');
		if (img && data.image) img.src = data.image;

		if (data.description) {
			const p = this.element.querySelector('.card__text');
			if (p) p.textContent = data.description;
		}

		this.btnAdd = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		const unavailable = data.price == null || data.price === 0;

		if (typeof actions === 'function') {
			this.btnAdd.textContent = unavailable ? 'Недоступно' : 'В корзину';
			this.btnAdd.disabled = unavailable;
			this.btnAdd.onclick = () => {
				if (!unavailable) actions();
			};
			return;
		}

		const { inCart, onAdd, onRemove } = actions;

		if (inCart) {
			this.btnAdd.textContent = 'Удалить из корзины';
			this.btnAdd.disabled = false;
			this.btnAdd.onclick = () => onRemove();
		} else if (unavailable) {
			this.btnAdd.textContent = 'Недоступно';
			this.btnAdd.disabled = true;
			this.btnAdd.onclick = null;
		} else {
			this.btnAdd.textContent = 'В корзину';
			this.btnAdd.disabled = false;
			this.btnAdd.onclick = () => onAdd();
		}
	}
}
