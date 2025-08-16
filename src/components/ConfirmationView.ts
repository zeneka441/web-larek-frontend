import { cloneTemplate, ensureElement } from '../utils/utils';
import { SELECTORS, CURRENCY } from '../utils/constants';

export class ConfirmationView {
	element = cloneTemplate<HTMLElement>(SELECTORS.tpl.success);
	private desc = ensureElement<HTMLParagraphElement>(
		'.order-success__description',
		this.element
	);
	private closeBtn = ensureElement<HTMLButtonElement>(
		'.order-success__close',
		this.element
	);

	render(total: number, onClose: () => void) {
		this.desc.textContent = `Списано ${total} ${CURRENCY}`;
		this.closeBtn.onclick = onClose;
		return this.element;
	}
}
