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

	private payment: 'online' | 'cash' | null = null;
	private paymentClicked = false;

	constructor(onDone: (data: TPayment) => void) {
		this.btnCard.addEventListener('click', () => this.choosePayment('online'));
		this.btnCash.addEventListener('click', () => this.choosePayment('cash'));

		this.address.addEventListener('input', () =>
			this.validate(this.paymentClicked)
		);

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.validate(true)) {
				onDone({
					paymentType: this.payment as 'online' | 'cash',
					address: this.address.value.trim(),
				});
			}
		});

		this.errors.textContent = '';
		this.validate(false);
	}

	private choosePayment(p: 'online' | 'cash') {
		this.payment = p;
		this.paymentClicked = true;

		this.btnCard.classList.toggle('button_alt', p !== 'online');
		this.btnCash.classList.toggle('button_alt', p !== 'cash');

		this.validate(true);
	}

	private validate(showErrors: boolean): boolean {
		const addressOk = this.address.value.trim().length > 0;
		const paymentOk = this.payment !== null;

		setDisabled(this.submit, !(addressOk && paymentOk));

		if (showErrors) {
			if (!paymentOk) this.errors.textContent = 'Выберите способ оплаты';
			else if (!addressOk) this.errors.textContent = 'Необходимо указать адрес';
			else this.errors.textContent = '';
		} else {
			this.errors.textContent = '';
		}

		return addressOk && paymentOk;
	}
}
