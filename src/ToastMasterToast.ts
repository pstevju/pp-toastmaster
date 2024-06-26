/**
 * Represents the variant of a toast message.
 * Possible values are 'info', 'success', 'warning', and 'error'.
 */
export type ToastMasterToastVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Represents the options for a toast item in ToastMaster.
 */
export type ToastMasterToastOptions = {
	/**
	 * The scope of the toast item.
	 * @default ''
	 */
	scope?: string;

	/**
	 * The content of the toast item. Required.
	 */
	content: string;

	/**
	 * Number of milliseconds before the toasts auto hide or a boolean for toggle.
	 * Zero or false means no autohide.
	 * @default 5000
	 */
	autohide?: number | boolean;

	/**
	 * The variant of the toast item. Optional.
	 * @default 'info'
	 */
	variant?: ToastMasterToastVariant;
};

/**
 * Represents the position of a toast message.
 * Can be one of the following values: 'start', 'center', or 'end'.
 */
export type ToastMasterToastPosition = 'start' | 'center' | 'end';

/**
 * Object representing the positioning of a toast.
 */
export type ToastMasterToastPositioning = {
	/**
	 * The horizontal position of the toast container.
	 * @default 'end'
	 */
	horizontalAlignment?: ToastMasterToastPosition;

	/**
	 * The vertical position of the toast container.
	 * @default 'end'
	 */
	verticalAlignment?: ToastMasterToastPosition;

	/**
	 * Top horizontal distance from the screen edge (Bootstrap class shortcut units).
	 * @default 3
	 */
	horizontalOffset?: 1 | 2 | 3 | 4 | 5;

	/**
	 * Top vertical distance from the screen edge (Bootstrap class shortcut units).
	 * @default 2
	 */
	verticalOffset?: 1 | 2 | 3 | 4 | 5;
};

/**
 * Represents a Toast object.
 * @class
 */
export class ToastMasterToast {
	/**
	 * The UUID of the toast item.
	 */
	private _id: string = crypto.randomUUID();

	/**
	 * The scope of the toast item.
	 */
	private _scope: string = '';

	/**
	 * The content of the toast item.
	 */
	private _content: string = '';

	/**
	 * The autohide delay of the toast item.
	 */
	private _autohide: number = 5000;

	/**
	 * The variant of the toast item.
	 */
	private _variant: ToastMasterToastVariant = 'info';

	/**
	 * The DOM element of the toast item.
	 */
	private _element: HTMLDivElement;

	/**
	 * The Bootstrap Toast instance of the item.
	 */
	private _instance: bootstrap.Toast;

	/**
	 * Indicates whether the toast item has been disposed.
	 */
	private _isDisposed: boolean = false;

	/**
	 * Gets the UUID of the toast item.
	 * @returns The UUID of the toast item.
	 */
	getId() {
		return this._id;
	}

	/**
	 * Gets the scope of the toast item.
	 * @returns The scope of the toast item.
	 */
	getScope() {
		return this._scope;
	}

	/**
	 * Gets the content of the toast item.
	 * @returns The content of the toast item.
	 */
	getContent() {
		return this._content;
	}

	/**
	 * Gets the variant of the toast item.
	 * @returns The variant of the toast item.
	 */
	getVariant() {
		return this._variant;
	}

	/**
	 * Creates a new global toast item and displays it in the global toast container.
	 * @param container The global toast container DOM element.
	 * @param options Options for the toast item.
	 */
	constructor(container: HTMLElement, options: ToastMasterToastOptions) {
		// Make sure the options parameter is an object and has at least one of the required properties.
		if (typeof options === undefined) {
			throw new Error('The options parameter must be set.');
		} else if (typeof options !== 'object') {
			throw new Error('The options parameter must be an object.');
		}

		// Make sure the scope value has the correct property types.
		if (options.scope !== undefined) {
			if (typeof options.scope !== 'string') {
				throw new Error(`The scope option must be a string.`);
			} else {
				this._scope = options.scope;
			}
		}

		// Make sure the content value has the correct property types.
		if (typeof options.content !== 'string') {
			throw new Error(`The content option must be a string.`);
		} else {
			this._content = options.content;
		}

		// Make sure the autohide value has the correct property types.
		if (options.autohide !== undefined) {
			if (typeof options.autohide !== 'number' && typeof options.autohide !== 'boolean') {
				throw new Error('The autohide option must be a number or a boolean.');
			} else {
				this._autohide = options.autohide === true || options.autohide === undefined ? 5000 : typeof options.autohide === 'number' && options.autohide > 0 ? options.autohide : 0;
			}
		}

		// Make sure the variant value has the correct property types.
		if (options.variant !== undefined) {
			if (typeof options.variant !== 'string' || !['info', 'success', 'warning', 'error'].includes(options.variant)) {
				throw new Error('The variant option must be one of the following values: info, success, warning, error.');
			}
			this._variant = options.variant;
		}

		// Create shorthands for checking toast content and variant.
		// const isInfo = this._variant === 'info';
		// const isSuccess = this._variant === 'success';
		const isWarning = this._variant === 'warning';
		const isError = this._variant === 'error';

		// Initialize the toast element.
		this._element = Object.assign(document.createElement('div'), {
			id: `toast-master-toast-${this._id}`,
			className: 'toast m-0 mw-100 border border-0',
			ariaAtomic: 'true',
			role: isError || isWarning ? 'alert' : undefined,
			ariaLive: isError || isWarning ? 'assertive' : undefined,
		} as HTMLDivElement);
		Object.assign(this._element.style, {
			width: 'max-content',
			minWidth: 'var(--bs-toast-max-width)',
		});
		if (this._autohide > 0) {
			this._element.setAttribute('data-bs-delay', this._autohide.toString());
		} else {
			this._element.setAttribute('data-bs-autohide', 'false');
		}

		// Initialize the toast icon.
		const _icon = (() => {
			const featherOptions = { width: '1.7em', height: '1.7em', class: 'p-1 rounded', style: 'min-width: 1.7em !important; min-height: 1.7em !important;' };
			switch (this._variant) {
				case 'success':
					return feather.icons['check'].toSvg({ ...featherOptions, style: featherOptions.style + ' background: rgba(var(--bs-success-rgb), 0.15); color: var(--bs-success);' });
				case 'warning':
					return feather.icons['alert-circle'].toSvg({ ...featherOptions, style: featherOptions.style + ' background: rgba(var(--bs-warning-rgb), 0.15); color: var(--bs-warning);' });
				case 'error':
					return feather.icons['alert-triangle'].toSvg({ ...featherOptions, style: featherOptions.style + ' background: rgba(var(--bs-danger-rgb), 0.15); color: var(--bs-danger);' });
				default:
					return '';
			}
		})();

		// Generate the toast body wrapper element.
		const _toastBody = Object.assign(document.createElement('div'), {
			className: 'toast-body d-flex flex-row align-items-center py-0',
		} as HTMLDivElement);

		// Generate the toast body content element.
		const _toastContent = Object.assign(document.createElement('div'), {
			title: this._content,
			innerText: this._content,
			className: 'me-auto text-dark fw-bold p-3',
		} as HTMLDivElement);
		Object.assign(_toastContent.style, {
			textOverflow: 'ellipsis',
		});

		// Generate the toast close button element.
		const _toastCloseButton = Object.assign(document.createElement('button'), {
			type: 'button',
			className: 'rounded-0 btn-close border-start ps-3 align-self-stretch',
			ariaLabel: 'Close',
			innerHTML: feather.icons['x'].toSvg(),
		} as HTMLButtonElement);
		_toastCloseButton.setAttribute('data-bs-dismiss', 'toast');

		// Append the toast elements to the toast body.
		_toastBody.innerHTML = _icon;
		_toastBody.appendChild(_toastContent);
		_toastBody.appendChild(_toastCloseButton);

		// Append the toast body to the toast element.
		this._element.appendChild(_toastBody);

		// Add callbacks for Bootstrap toast events.
		this._element.addEventListener('hidden.bs.toast', () => this._element.remove());
		this._element.addEventListener('hide.bs.toast', () => (this._isDisposed = true));

		// Append the toast element to the global toast container.
		container.appendChild(this._element);

		// Create a new Bootstrap Toast instance and show the toast.
		this._instance = bootstrap.Toast.getOrCreateInstance(this._element);
		this._instance.show();
	}

	/**
	 * Disposes and hides the toast item and removes it from the DOM.
	 */
	dispose() {
		if (this._isDisposed) return;
		this._instance.hide();
	}
}