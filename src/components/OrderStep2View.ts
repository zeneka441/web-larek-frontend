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

	private showErrors = false;

	constructor(onDone: (data: TContact) => void) {
		const onInput = () => this.validate(this.showErrors);
		this.email.addEventListener('input', onInput);
		this.phone.addEventListener('input', onInput);

		const onBlur = () => {
			this.showErrors = true;
			this.validate(true);
		};
		this.email.addEventListener('blur', onBlur);
		this.phone.addEventListener('blur', onBlur);

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			this.showErrors = true;
			if (this.validate(true)) {
				onDone({
					email: this.email.value.trim(),
					phone: this.phone.value.trim(),
				});
			}
		});

		this.errors.textContent = '';
		this.validate(false);
	}

	private validate(showErrors: boolean): boolean {
		const emailOk = /\S+@\S+\.\S+/.test(this.email.value.trim());
		const phoneOk = this.phone.value.replace(/\D/g, '').length >= 6;
		const ok = emailOk && phoneOk;

		setDisabled(this.submit, !ok);

		if (showErrors) {
			if (!emailOk) this.errors.textContent = 'Введите email';
			else if (!phoneOk) this.errors.textContent = 'Введите номер телефона';
			else this.errors.textContent = '';
		} else {
			this.errors.textContent = '';
		}

		return ok;
	}
}
