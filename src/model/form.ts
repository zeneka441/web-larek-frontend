import type { ICard, IForm, TContact, TPayment } from '../types';
import { EventEmitter } from '../components/base/events';

export class FormDataModel {
	paymentType: 'online' | 'cash' = 'online';
	address = '';
	email = '';
	phone = '';

	constructor(private events: EventEmitter) {}

	setPaymentAndAddress(step1: TPayment) {
		this.paymentType = step1.paymentType;
		this.address = step1.address.trim();
		this.events.emit('form:step1-completed', step1);
	}

	setContacts(step2: TContact) {
		this.email = step2.email.trim();
		this.phone = step2.phone.trim();
		this.events.emit('form:step2-completed', step2);
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
		this.paymentType = 'online';
		this.address = this.email = this.phone = '';
		this.events.emit('order:reset');
	}
}
