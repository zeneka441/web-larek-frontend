import { ensureElement } from '../utils/utils';
import { SELECTORS } from '../utils/constants';

export class CatalogView {
	private container: HTMLElement;
	private basketBtn: HTMLButtonElement;
	private counterEl: HTMLElement;

	constructor() {
		this.container = ensureElement<HTMLElement>(SELECTORS.gallery);
		this.basketBtn = ensureElement<HTMLButtonElement>(SELECTORS.basketButton);
		this.counterEl = ensureElement<HTMLSpanElement>(SELECTORS.basketCounter);
	}

	render(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}

	onBasketClick(handler: () => void) {
		this.basketBtn.onclick = handler;
	}

	setCounter(count: number) {
		this.counterEl.textContent = String(count);
	}
}
