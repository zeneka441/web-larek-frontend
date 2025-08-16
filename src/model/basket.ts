import type { ICard } from '../types';
import { EventEmitter } from '../components/base/events';

export class BasketModel {
	private items: ICard[] = [];

	constructor(private events: EventEmitter) {}

	add(card: ICard) {
		if (this.items.some((i) => i._id === card._id)) return;
		this.items.push(card);
		this.events.emit('cart:changed', this.getItems());
	}

	remove(id: string) {
		this.items = this.items.filter((i) => i._id !== id);
		this.events.emit('cart:changed', this.getItems());
	}

	clear() {
		this.items = [];
		this.events.emit('cart:changed', this.getItems());
	}

	getItems() {
		return [...this.items];
	}

	getTotal() {
		return this.items.reduce((s, it) => s + (it.price ?? 0), 0);
	}
}
