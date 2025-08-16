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

export class CardPreviewView {
	element: HTMLElement;
	private btnAdd: HTMLButtonElement;

	constructor(
		data: TProductThumbnail & { description?: string },
		onAdd: () => void
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
		this.btnAdd.addEventListener('click', onAdd);
		if (data.price === null) this.btnAdd.setAttribute('disabled', 'true');
	}
}
