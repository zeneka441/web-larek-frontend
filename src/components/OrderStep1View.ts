import { cloneTemplate, ensureElement } from '../utils/utils';
import { setDisabled } from '../utils/helpers';
import { SELECTORS } from '../utils/constants';

type Handlers = {
	onPaymentSelect: (p: 'online' | 'cash') => void;
	onAddressInput: (value: string) => void;
	onSubmit: () => void;
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

	constructor(private handlers: Handlers) {
		this.btnCard.addEventListener('click', () => {
			this.choosePayment('online');
			this.handlers.onPaymentSelect('online');
		});
		this.btnCash.addEventListener('click', () => {
			this.choosePayment('cash');
			this.handlers.onPaymentSelect('cash');
		});
		this.address.addEventListener('input', () => {
			this.handlers.onAddressInput(this.address.value);
		});
		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			this.handlers.onSubmit();
		});

		this.setError('');
		this.setSubmitBtnEnabled(false);
	}

	private choosePayment(p: 'online' | 'cash') {
		this.btnCard.classList.toggle('button_alt', p !== 'online');
		this.btnCash.classList.toggle('button_alt', p !== 'cash');
	}

	setError(msg: string) {
		this.errors.textContent = msg;
	}
	setSubmitBtnEnabled(enabled: boolean) {
		setDisabled(this.submit, !enabled);
	}
}
