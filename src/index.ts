import './scss/styles.scss';
import type { ICard, TProductThumbnail, TPayment, TContact } from './types';

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
import { CartItem } from './components/CartItem';

document.addEventListener('DOMContentLoaded', async () => {
	ensureElement<HTMLDivElement>(SELECTORS.modalRoot).classList.remove(
		'modal_active'
	);

	const events = new EventEmitter();
	const api = new LarekApi();
	const cards = new CardsList(events);
	const basket = new BasketModel(events);
	const form = new FormDataModel(events);
	const catalogView = new CatalogView();
	const modal = new Modal(
		ensureElement<HTMLDivElement>(SELECTORS.modalRoot),
		events
	);

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
		const inCart = basket.getItems().some((i) => i._id === card._id);

		const view = new CardPreviewView(card, {
			inCart,
			onAdd: () => {
				basket.add(card);
				modal.close();
			},
			onRemove: () => {
				basket.remove(card._id);
				modal.close();
			},
		});

		modal.render({ content: view.element });
	}

	function openBasket() {
		const items = new CartView();
		items.render(
			basket.getItems().map(
				(i, idx) =>
					new CartItem(
						{ _id: i._id, title: i.title, price: i.price },
						idx + 1,
						(id) => {
							basket.remove(id);
							openBasket();
						}
					).element
			),
			basket.getTotal(),
			() => openOrderStep1()
		);
		modal.render({ content: items.element });
	}

	function openOrderStep1() {
		const step1 = new OrderStep1View(
			form.validateStep1.bind(form),
			(data: TPayment) => {
				form.setPaymentAndAddress(data);
				openOrderStep2();
			}
		);
		modal.render({ content: step1.element });
	}

	function openOrderStep2() {
		const step2 = new OrderStep2View(async (data: TContact) => {
			form.setContacts(data);
			const order = form.toOrder(basket.getItems());

			const res = await api.createOrder(order);
			basket.clear();
			form.reset();

			const ok = new ConfirmationView();
			modal.render({ content: ok.render(res.total, () => modal.close()) });
		});
		modal.render({ content: step2.element });
	}

	catalogView.onBasketClick(() => openBasket());

	events.on('cart:changed', () => {
		catalogView.setCounter(basket.getItems().length);
	});

	try {
		const catalog = await api.getProductList();
		cards.setCards(catalog);
		renderCatalog(catalog);

		catalogView.setCounter(basket.getItems().length);
		events.on<ICard>('catalog:preview', (card) => openPreview(card));
	} catch (e) {
		e instanceof Error ? e.message : String(e);
	}
});
