import { cloneTemplate, ensureElement } from '../utils/utils';
import { setDisabled } from '../utils/helpers';
import { SELECTORS } from '../utils/constants';
import type { TPayment } from '../types';

type Step1Validator = (
	payment: 'online' | 'cash' | null,
	address: string
) => {
	valid: boolean;
	paymentOk: boolean;
	addressOk: boolean;
	paymentError?: string;
	addressError?: string;
};

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
	private addressEntered = false;

	constructor(
		private validateStep1: Step1Validator,
		onDone: (data: TPayment) => void
	) {
		this.btnCard.addEventListener('click', () => this.choosePayment('online'));
		this.btnCash.addEventListener('click', () => this.choosePayment('cash'));

		this.address.addEventListener('input', () => {
			this.addressEntered = this.address.value.trim().length > 0;
			this.validate(false);
		});

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

	private validate(showAllErrors: boolean): boolean {
		const { valid, paymentOk, addressOk, paymentError, addressError } =
			this.validateStep1(this.payment, this.address.value);

		setDisabled(this.submit, !valid);

		let msg = '';
		if (!paymentOk && (showAllErrors || this.addressEntered)) {
			msg = paymentError ?? '';
		} else if (!addressOk && (showAllErrors || this.paymentClicked)) {
			msg = addressError ?? '';
		}
		this.errors.textContent = msg;

		return valid;
	}
}
