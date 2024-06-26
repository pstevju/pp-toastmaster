import { ToastMasterToast, ToastMasterToastOptions, ToastMasterToastPosition, ToastMasterToastPositioning, ToastMasterToastVariant } from './ToastMasterToast';

export class ToastMaster {
	/**
	 * The instance ID of the ToastMaster instance.
	 */
	private _id: string = crypto.randomUUID();

	/**
	 * The ToastMaster version.
	 */
	/**
	 * Returns the version of the toast master.
	 * @returns The version of the toast master.
	 */
	static version = __APP_VERSION__;

	constructor() {
		// Log the current version and ID of the ToastMaster instance.
		console.log(`ToastMaster ${ToastMaster.version} loaded (ID: ${this._id}).`);

		Object.assign(this._container, {
			id: `toast-master-${this._id}`,
			ariaLive: 'polite',
			ariaAtomic: 'true',
			className: `toast-master-container position-fixed d-flex flex-column gap-3 align-items-end`,
		} as HTMLDivElement);

		Object.assign(this._container.style, {
			zIndex: '9999',
		});

		// Set the initial positioning of the toast container.
		this.setPositioning(this._currentPositioning);

		// Set the initial parent of the toast container.
		this.setParent(document.body);
	}

	/**
	 * A map of toast items by their UUID.
	 */
	private _toastMap = new Map<string, ToastMasterToast>();

	/**
	 * Default positioning values for the toast container.
	 */
	private _currentPositioning: ToastMasterToastPositioning = {
		horizontalAlignment: 'end',
		verticalAlignment: 'end',
		horizontalOffset: 3,
		verticalOffset: 2,
	};

	// Create the toast container element.
	private _container = document.createElement('div');

	/**
	 * Checks if the given variant is a valid ToastMasterToastVariant value.
	 * @param value The value to be validated.
	 * @returns Returns true if the variant is valid, otherwise false.
	 */
	private _isValidVariant = (value: any): value is ToastMasterToastVariant => {
		return ['info', 'success', 'warning', 'error'].includes(value);
	};

	/**
	 * Checks if the given position is valid.
	 * @param value The value to be checked.
	 * @returns Returns true if the position is valid, otherwise false.
	 */
	private _isValidPosition = (value: any): value is ToastMasterToastPosition => {
		return ['start', 'center', 'end'].includes(value);
	};

	/**
	 * Sets the positioning options for the toast and updates the container.
	 * @param positioning The positioning options to be set.
	 */
	setPositioning = (positioning: ToastMasterToastPositioning) => {
		if (!this._isValidPosition(positioning.horizontalAlignment)) delete positioning.horizontalAlignment;
		if (!this._isValidPosition(positioning.verticalAlignment)) delete positioning.verticalAlignment;
		this._currentPositioning = { ...this._currentPositioning, ...positioning };

		this._container.className = Array.from(this._container.classList)
			.filter((className) => !(className.startsWith('top-') || className.startsWith('bottom-') || className.startsWith('start-') || className.startsWith('end-') || className.startsWith('mx-') || className.startsWith('my-')))
			.join(' ');

		if (this._currentPositioning.horizontalAlignment === 'start') {
			this._container.classList.add(`start-0`);
		} else if (this._currentPositioning.horizontalAlignment === 'end') {
			this._container.classList.add(`end-0`);
		} else if (this._currentPositioning.horizontalAlignment === 'center') {
			this._container.classList.add(`start-50`, `translate-middle-x`);
		}
		if (this._currentPositioning.verticalAlignment === 'start') {
			this._container.classList.add(`top-0`);
		} else if (this._currentPositioning.verticalAlignment === 'end') {
			this._container.classList.add(`bottom-0`);
		} else if (this._currentPositioning.verticalAlignment === 'center') {
			this._container.classList.add(`top-50`, `translate-middle-y`);
		}
		this._container.classList.add(`mx-${this._currentPositioning.horizontalOffset}`);
		this._container.classList.add(`my-${this._currentPositioning.verticalOffset}`);
	};

	/**
	 * Moves the toast container to the specified parent element.
	 * @param parent The new parent element.
	 */
	setParent = (parent: HTMLElement) => {
		if (parent instanceof HTMLElement) {
			parent.appendChild(this._container);
		}
	};

	/**
	 * Disposes all toasts.
	 */
	disposeAllToasts = () => {
		for (const toast of this._toastMap.values()) toast.dispose();
		this._toastMap.clear();
	};

	/**
	 * Disposes a toast item by its ID.
	 * @param id The UUID of the toast item to dispose.
	 */
	disposeToastById = (id: string) => {
		const toast = this._toastMap.get(id);
		if (toast) {
			toast.dispose();
			this._toastMap.delete(id);
		}
	};

	/**
	 * Disposes all toast items associated with the given scope.
	 * @param scope The scope value.
	 */
	disposeToastsByScope = (scope: string) => {
		this._toastMap.forEach((toast) => {
			if (toast.getScope() === scope) {
				toast.dispose();
				this._toastMap.delete(toast.getId());
			}
		});
	};

	/**
	 * Disposes all toast items with of the given variant.
	 * @param variant The variant value.
	 */
	disposeToastsByVariant = (variant: ToastMasterToastVariant) => {
		if (!this._isValidVariant(variant)) {
			throw new Error('The variant must be one of the following values: info, success, warning, error.');
		}
		this._toastMap.forEach((toast) => {
			if (toast.getVariant() === variant) {
				toast.dispose();
				this._toastMap.delete(toast.getId());
			}
		});
	};

	/**
	 * Gets a toast item by its ID.
	 * @param id The UUID of the toast item to get.
	 * @returns The toast item with the specified UUID, or undefined if no item is found.
	 */
	getToastById = (id: string) => {
		return this._toastMap.get(id);
	};

	/**
	 * Gets a list of toast items by their scope value.
	 * @param scope The scope of the toast items to get.
	 * @returns An array of toast items with the specified scope value, or null if no item is found.
	 */
	getToastsByScope = (scope: string) => {
		return Array.from(this._toastMap.values()).filter((toast) => toast.getScope() === scope);
	};

	/**
	 * Creates a new global toast item and displays it in the global toast container.
	 * @param options Options for the toast item.
	 * @returns The newly created toast item.
	 */
	createToast = (options: ToastMasterToastOptions) => {
		const toast = new ToastMasterToast(this._container, options);
		this._toastMap.set(toast.getId(), toast);
		return toast;
	};

	/**
	 * Creates a success toast with the given success message.
	 * @param successMessage The success message to display in the toast.
	 */
	createSuccessToast = (successMessage: string) => {
		return this.createToast({
			variant: 'success',
			content: successMessage,
		});
	};

	/**
	 * Creates a warning toast with the specified warning message.
	 * @param warningMessage The warning message to display in the toast.
	 */
	createWarningToast = (warningMessage: string) => {
		return this.createToast({
			variant: 'warning',
			content: warningMessage,
			autohide: 10000,
		});
	};

	/**
	 * Creates an error toast with the specified error message.
	 * @param errorMessage The error message to display in the toast.
	 */
	createErrorToast = (errorMessage: string) => {
		return this.createToast({
			variant: 'error',
			content: errorMessage,
			autohide: false,
		});
	};
}
