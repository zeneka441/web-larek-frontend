import { cloneTemplate, ensureElement } from '../utils/utils';
import { setDisabled } from '../utils/helpers';
import { SELECTORS } from '../utils/constants';
import type { TPayment } from '../types';

export class OrderStep1View {
	element = cloneTemplate<HTMLFormElement>(SELECTORS.tpl.order);
	private address = ensureElement<HTMLInputElement>(
		'input[name="address"]',
		this.element
	);
	private btnCard = ensureElement<HTMLButtonElement>(
		'button[name="card"]',
		this.element
	);
	private btnCash = ensureElement<HTMLButtonElement>(
		'button[name="cash"]',
		this.element
	);
	private submit = ensureElement<HTMLButtonElement>(
		'.order__button',
		this.element
	);
	private errors = ensureElement<HTMLSpanElement>(
		'.form__errors',
		this.element
	);

	private payment: 'online' | 'cash' = 'online';

	constructor(onDone: (data: TPayment) => void) {
		this.btnCard.addEventListener('click', () => this.setPayment('online'));
		this.btnCash.addEventListener('click', () => this.setPayment('cash'));
		this.address.addEventListener('input', () => this.validate());
		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.validate())
				onDone({ paymentType: this.payment, address: this.address.value });
		});
		this.validate();
	}

	private setPayment(p: 'online' | 'cash') {
		this.payment = p;
		this.btnCard.classList.toggle('button_alt', p !== 'online');
		this.btnCash.classList.toggle('button_alt', p !== 'cash');
		this.validate();
	}

	private validate(): boolean {
		const ok = this.address.value.trim().length > 3;
		this.errors.textContent = ok ? '' : 'Введите адрес (мин. 4 символа)';
		setDisabled(this.submit, !ok);
		return ok;
	}
}
