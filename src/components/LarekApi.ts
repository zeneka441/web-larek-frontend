import type { ICard, IForm } from '../types';
import { Api } from './base/api';
import { API_URL, CDN_URL } from '../utils/constants';

function absoluteImage(image?: string): string {
	if (!image) return '';
	if (/^https?:\/\//.test(image)) return image;
	return `${CDN_URL.replace(/\/$/, '')}/${String(image).replace(/^\//, '')}`;
}

function toList(res: unknown): ICard[] {
	if (Array.isArray(res)) return res as ICard[];
	if (res && typeof res === 'object') {
		const any = res as any;
		if (Array.isArray(any.items)) return any.items as ICard[];
		if (Array.isArray(any.data)) return any.data as ICard[];
		if (Array.isArray(any.products)) return any.products as ICard[];
		if (Array.isArray(any.result)) return any.result as ICard[];
	}
}

export class LarekApi {
	private api = new Api(API_URL);

	async getCatalog(): Promise<ICard[]> {
		try {
			const res = await this.api.get('/product');
			const list = toList(res).map((i) => ({
				...i,
				image: absoluteImage(i.image),
			}));
			return list;
		} catch (e) {
			return e;
		}
	}

	async createOrder(order: IForm): Promise<{ id: string; total: number }> {
		const tryPost = async (path: '/order' | '/order') => {
			const r = await this.api.post(path, order);
			const any = r as any;
			const id = String(any?.id ?? any?.data?.id ?? 'order');
			const total =
				typeof any?.total === 'number'
					? any.total
					: order.items.reduce((s, it) => s + (it.price ?? 0), 0);
			return { id, total };
		};
		try {
			return await tryPost('/order');
		} catch {
			return await tryPost('/order');
		}
	}
}
