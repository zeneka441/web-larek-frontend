import { ensureElement } from '../utils/utils';
import { SELECTORS } from '../utils/constants';

export class Modal {
	private root = ensureElement<HTMLDivElement>(SELECTORS.modalRoot);
	private content = ensureElement<HTMLDivElement>('.modal__content', this.root);
	private closeBtn = ensureElement<HTMLButtonElement>(
		'.modal__close',
		this.root
	);

	constructor() {
		this.closeBtn.addEventListener('click', () => this.close());
		this.root.addEventListener('click', (e) => {
			if (e.target === this.root) this.close();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') this.close();
		});
	}

	open(node: HTMLElement) {
		this.content.replaceChildren(node);
		this.root.classList.add('modal_active');
	}

	close() {
		this.root.classList.remove('modal_active');
		this.content.replaceChildren();
	}
}
