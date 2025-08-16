import { SELECTORS } from '../utils/constants';

export class CatalogView {
	private container = document.querySelector(SELECTORS.gallery)!;

	render(cardNodes: HTMLElement[]) {
		this.container.replaceChildren(...cardNodes);
	}
}
