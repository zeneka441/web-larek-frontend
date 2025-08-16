export function formatPrice(value: number | null, currency: string): string {
	if (value === null) return 'Бесценно';
	return `${value} ${currency}`;
}

export function setDisabled(el: HTMLElement | HTMLButtonElement, on: boolean) {
	if (on) el.setAttribute('disabled', 'true');
	else el.removeAttribute('disabled');
}
