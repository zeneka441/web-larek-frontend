import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	private _isOpen = false;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.container.classList.remove('modal_active');

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (e) => e.stopPropagation());

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this._isOpen) this.close();
		});
	}

	set content(value: HTMLElement | null) {
		this._content.replaceChildren(...(value ? [value] : []));
	}

	private applyViewportPosition() {
		this.container.style.position = 'fixed';
		this.container.style.inset = '0';
	}

	private resetPosition() {
		this.container.style.position = '';
		this.container.style.inset = '';
	}

	open() {
		if (this._isOpen) return;
		this.applyViewportPosition();
		this.container.classList.add('modal_active');
		this._isOpen = true;
		this.events.emit('modal:open');
	}

	close() {
		if (!this._isOpen) return;
		this.container.classList.remove('modal_active');
		this.content = null;
		this._isOpen = false;
		this.resetPosition();
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
