import './scss/styles.scss';
import type {
	ICard,
	TProductThumbnail,
	TProductCart,
	TPayment,
	TContact,
} from './types';

import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';

import { CardsList } from './model/cardsList';
import { BasketModel } from './model/basket';
import { FormDataModel } from './model/form';

import { CatalogView } from './components/CatalogView';

import { CardView, CardPreviewView } from './components/CardView';
import { CartView } from './components/CartView';
import { OrderStep1View } from './components/OrderStep1View';
import { OrderStep2View } from './components/OrderStep2View';
import { ConfirmationView } from './components/ConfirmationView';
import { Modal } from './components/Modal';

import { SELECTORS } from './utils/constants';
import { ensureElement } from './utils/utils';

document.addEventListener('DOMContentLoaded', async () => {
	const events = new EventEmitter();
	const api = new LarekApi();
	const cards = new CardsList(events);
	const basket = new BasketModel(events);
	const form = new FormDataModel(events);
	const catalogView = new CatalogView();
	const modal = new Modal();

	const basketBtn = ensureElement<HTMLButtonElement>(SELECTORS.basketButton);
	const basketCounter = ensureElement<HTMLSpanElement>(SELECTORS.basketCounter);

	function renderCatalog(list: ICard[]) {
		const nodes = list.map((c) => {
			const data: TProductThumbnail = {
				_id: c._id,
				title: c.title,
				image: c.image,
				category: c.category,
				price: c.price,
			};
			return new CardView(data, () => cards.showCard(c._id)).element;
		});
		catalogView.render(nodes);
	}

	function openPreview(card: ICard) {
		const view = new CardPreviewView(card, () => {
			basket.add(card);
			modal.close();
		});
		modal.open(view.element);
	}

	function openBasket() {
		const items: TProductCart[] = basket.getItems().map((i) => ({
			_id: i._id,
			title: i.title,
			price: i.price,
		}));
		const total = basket.getTotal();
		const cartView = new CartView();

		cartView.render(
			items,
			total,
			(id) => {
				basket.remove(id);
				openBasket();
			},
			() => openOrderStep1()
		);

		modal.open(cartView.element);
	}

	function openOrderStep1() {
		const step1 = new OrderStep1View((data: TPayment) => {
			form.setPaymentAndAddress(data);
			openOrderStep2();
		});
		modal.open(step1.element);
	}

	function openOrderStep2() {
		const step2 = new OrderStep2View(async (data: TContact) => {
			form.setContacts(data);
			const order = form.toOrder(basket.getItems());

			const res = await api.createOrder(order);
			basket.clear();
			form.reset();

			const ok = new ConfirmationView();
			modal.open(ok.render(res.total, () => modal.close()));
		});
		modal.open(step2.element);
	}

	function updateCounter() {
		basketCounter.textContent = String(basket.getItems().length);
	}

	try {
		const catalog = await api.getCatalog();
		cards.setCards(catalog);
		renderCatalog(catalog);

		basketBtn.addEventListener('click', () => openBasket());
		events.on<ICard>('catalog:preview', (card) => openPreview(card));
		events.on('cart:changed', () => updateCounter());
		updateCounter();
    } catch (e) {
        e instanceof Error ? e.message : String(e);
	}
});
