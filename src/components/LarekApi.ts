import { Api, ApiListResponse } from './base/api';
import type { ICard, IForm } from '../types';
import { API_URL, CDN_URL } from '../utils/constants';

export interface ILarekAPI {
	getProductList: () => Promise<ICard[]>;
	getProductItem: (id: string) => Promise<ICard>;
	createOrder: (order: IForm) => Promise<{ id: string; total: number }>;
}

function abs(cdn: string, image?: string): string {
	if (!image) return '';
	if (/^https?:\/\//.test(image)) return image;
	return `${cdn.replace(/\/$/, '')}/${String(image).replace(/^\//, '')}`;
}

function normalizeList<T>(res: unknown): T[] {
	if (Array.isArray(res)) return res as T[];
	if (res && typeof res === 'object') {
		const o = res as Record<string, unknown>;
		for (const key of ['items', 'data', 'products', 'result']) {
			const v = o[key];
			if (Array.isArray(v)) return v as T[];
		}
	}
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
		return this.get('/product').then(
			(data: ApiListResponse<ICard> | ICard[] | unknown) =>
				normalizeList<ICard>(data).map((item) => toCard(item, this.cdn))
		);
	}

	getProductItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard | unknown) =>
			toCard(item, this.cdn)
		);
	}

	createOrder(order: IForm): Promise<{ id: string; total: number }> {
		return this.post('/order', order).then((resp: unknown) => {
			const any = resp as Record<string, unknown>;
			const id = String(
				any.id ??
					(any.data as Record<string, unknown> | undefined)?.id ??
					'order'
			);
			const total =
				typeof any.total === 'number'
					? (any.total as number)
					: order.items.reduce((s, it) => s + (it.price ?? 0), 0);
			return { id, total };
		});
	}
}
