import type { ICard, IForm, TPayment, TContact } from '../types';
import type { IEvents } from '../components/base/events';


export class FormDataModel {
	paymentType: 'online' | 'cash' | null = null;
	address = '';
	email = '';
	phone = '';

	constructor(private events: IEvents) {}

	validateStep1(
		payment: 'online' | 'cash' | null,
		address: string
	): {
		valid: boolean;
		paymentOk: boolean;
		addressOk: boolean;
		paymentError?: string;
		addressError?: string;
	} {
		const paymentOk = payment !== null;
		const addressOk = address.trim().length > 0;

		return {
			valid: paymentOk && addressOk,
			paymentOk,
			addressOk,
			paymentError: paymentOk ? undefined : 'Выберите способ оплаты',
			addressError: addressOk ? undefined : 'Необходимо указать адрес',
		};
	}

	setPaymentAndAddress({ paymentType, address }: TPayment) {
		this.paymentType = paymentType;
		this.address = address.trim();
		this.events.emit('form:step1', {
			paymentType: this.paymentType,
			address: this.address,
		});
	}

	setContacts({ email, phone }: TContact) {
		this.email = email.trim();
		this.phone = phone.trim();
		this.events.emit('form:step2', { email: this.email, phone: this.phone });
	}

	toOrder(items: ICard[]): IForm {
		return {
			paymentType: this.paymentType,
			address: this.address,
			email: this.email,
			phone: this.phone,
			items,
		};
	}

	reset() {
		this.paymentType = null;
		this.address = '';
		this.email = '';
		this.phone = '';
		this.events.emit('form:reset', {});
	}
}
