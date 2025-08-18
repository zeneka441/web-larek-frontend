import type { TProductThumbnail } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { SELECTORS, CURRENCY } from '../utils/constants';
import { formatPrice } from '../utils/helpers';

export class CardView {
	element: HTMLElement;

	title: HTMLElement;
	category: HTMLElement;
	price: HTMLElement;
	img?: HTMLImageElement;

	constructor(data: TProductThumbnail, onOpen: () => void) {
		this.element = cloneTemplate<HTMLElement>(SELECTORS.tpl.cardCatalog);

		this.title = ensureElement<HTMLElement>('.card__title', this.element);
		this.category = ensureElement<HTMLElement>(
			'.card__category',
			this.element
		);
		this.price = ensureElement<HTMLElement>('.card__price', this.element);
		this.img =
			this.element.querySelector<HTMLImageElement>('.card__image');

		this.patch(data);
		this.element.addEventListener('click', onOpen);
	}

	patch(data: TProductThumbnail) {
		this.title.textContent = data.title;
		this.category.textContent = data.category;
		this.price.textContent = formatPrice(data.price ?? 0, CURRENCY);
		if (this.img && data.image) this.img.src = data.image;
	}
}

type PreviewActions =
	| (() => void)
	| { inCart: boolean; onAdd: () => void; onRemove: () => void };

export class CardPreviewView {
	element: HTMLElement;

	title: HTMLElement;
	category: HTMLElement;
	price: HTMLElement;
	img?: HTMLImageElement;
	text?: HTMLElement;
	btnAdd: HTMLButtonElement;

	constructor(
		data: TProductThumbnail & { description?: string },
		actions: PreviewActions
	) {
		this.element = cloneTemplate<HTMLElement>(SELECTORS.tpl.cardPreview);

		this.title = ensureElement<HTMLElement>('.card__title', this.element);
		this.category = ensureElement<HTMLElement>(
			'.card__category',
			this.element
		);
		this.price = ensureElement<HTMLElement>('.card__price', this.element);
		this.img =
			this.element.querySelector<HTMLImageElement>('.card__image');
		this.text =
			this.element.querySelector<HTMLElement>('.card__text');
		this.btnAdd = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);

		this.title.textContent = data.title;
		this.category.textContent = data.category;
		this.price.textContent = formatPrice(data.price ?? 0, CURRENCY);
		if (this.img && data.image) this.img.src = data.image;
		if (this.text && data.description)
			this.text.textContent = data.description;

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
