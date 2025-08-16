import { cloneTemplate, ensureElement } from '../utils/utils';
import { setDisabled } from '../utils/helpers';
import { SELECTORS } from '../utils/constants';
import type { TContact } from '../types';

export class OrderStep2View {
	element = cloneTemplate<HTMLFormElement>(SELECTORS.tpl.contacts);
	private email = ensureElement<HTMLInputElement>(
		'input[name="email"]',
		this.element
	);
	private phone = ensureElement<HTMLInputElement>(
		'input[name="phone"]',
		this.element
	);
	private submit = ensureElement<HTMLButtonElement>(
		'button[type="submit"]',
		this.element
	);
	private errors = ensureElement<HTMLSpanElement>(
		'.form__errors',
		this.element
	);

	constructor(onDone: (data: TContact) => void) {
		const onInput = () => this.validate();
		this.email.addEventListener('input', onInput);
		this.phone.addEventListener('input', onInput);
		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.validate())
				onDone({ email: this.email.value, phone: this.phone.value });
		});
		this.validate();
	}

	private validate(): boolean {
		const emailOk = /\S+@\S+\.\S+/.test(this.email.value);
		const phoneOk = this.phone.value.replace(/\D/g, '').length >= 6;
		const ok = emailOk && phoneOk;
		this.errors.textContent = ok ? '' : 'Введите корректные email и телефон';
		setDisabled(this.submit, !ok);
		return ok;
	}
}
