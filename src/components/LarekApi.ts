import { Api, ApiListResponse } from './base/api';
import type { ICard, IForm } from '../types';
import { API_URL, CDN_URL } from '../utils/constants';

export interface ILarekAPI {
	getProductList: () => Promise<ICard[]>;
	getProductItem: (id: string) => Promise<ICard>;
	createOrder: (order: IForm) => Promise<{ id: string; total: number }>;
}

type ProductListResponse = ApiListResponse<ICard>;

function abs(cdn: string, image?: string): string {
	if (!image) return '';
	if (/^https?:\/\//.test(image)) return image;
	return `${cdn.replace(/\/$/, '')}/${String(image).replace(/^\//, '')}`;
}

function toCard(raw: unknown, cdn: string): ICard {
	const any = raw as Record<string, unknown>;
	const id = String((any._id as string | number | undefined) ?? any.id ?? '');
	return {
		...(any as object),
		_id: id,
		image: abs(cdn, any.image as string | undefined),
	} as ICard;
}

function calcTotal(items: ICard[]): number {
	return items.reduce(
		(sum, it) => sum + (typeof it.price === 'number' ? it.price : 0),
		0
	);
}

function normalizeListStrict(res: ProductListResponse | ICard[]): ICard[] {
	return Array.isArray(res) ? res : res.items;
}

export class LarekApi extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(
		cdn: string = CDN_URL,
		baseUrl: string = API_URL,
		options?: RequestInit
	) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<ICard[]> {
		return this.get('/product').then((data: ProductListResponse | ICard[]) =>
			normalizeListStrict(data).map((item) => toCard(item, this.cdn))
		);
	}

	getProductItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: unknown) =>
			toCard(item, this.cdn)
		);
	}

	createOrder(order: IForm): Promise<{ id: string; total: number }> {
		const total = calcTotal(order.items);

		const payload = {
			payment: order.paymentType === 'online' ? 'card' : 'cash',
			email: order.email,
			phone: order.phone,
			address: order.address,
			items: order.items.map((i) => i._id),
			total,
		};

		return this.post('/order', payload).then((resp: unknown) => {
			const any = resp as Record<string, unknown>;
			const id = String(
				any.id ??
					(any.data as Record<string, unknown> | undefined)?.id ??
					'order'
			);
			const respTotal =
				typeof any.total === 'number' ? (any.total as number) : total;
			return { id, total: respTotal };
		});
	}
}
