import type { ICard } from '../types';
import { EventEmitter } from '../components/base/events';

export class CardsList {
	public cards: ICard[] = [];
	public preview: string | null = null;

	constructor(private events: EventEmitter) {}

	setCards(cards: ICard[]) {
		this.cards = cards;
		this.events.emit('catalog:loaded', cards);
	}

	getCard(id: string) {
		const found = this.cards.find((c) => c._id === id);
		return found;
	}

	showCard(id: string) {
		this.preview = id;
		this.events.emit('catalog:preview', this.getCard(id));
	}
}
