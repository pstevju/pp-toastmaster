# ToastMaster

## Overview

ToastMaster is an ES module toast manager, built to simplify handling of Bootstrap v5 toasts in Power Pages sites.

## Installation

```sh
npm i pp-toastmaster
```

## Usage

```javascript
// Import the ToastMaster class from the ES module.
import { ToastMaster } from 'pp-toastmaster';

// Create a new ToastMaster instance and attach it to the body element of the document.
// Consider a singleton approach with one global instance per page.
const toastMaster = new ToastMaster();

// Create a success style toast using the createSuccessToast shorthand.
toastMaster.createSuccessToast('Operation completed successfully!');

// Create a warning style toast using the createWarningToast shorthand.
toastMaster.createWarningToast('This is a warning message.');

// Create an error style toast using the createErrorToast shorthand.
toastMaster.createErrorToast('An error occurred.');

// Create a generic style persistent toast with the createToast method.
toastMaster.createToast({ content: 'Something occured.', autohide: false });

// Update positioning settings.
toastMaster.setPositioning({
  /* Setting all values is not required. Previous values will be kept. */
  //horizontalAlignment: 'center',

  verticalAlignment: 'start',

  horizontalOffset: 2,

  verticalOffset: 4,
});

// Log the current ToastMaster version (notice the static method call).
console.log(ToastMaster.version);
```
## Static variables

### `version`
Holds the version of the loaded ToastMaster module.

```typescript
version: string
```

## Methods

### `disposeAllToasts()`
Disposes all toasts managed by the ToastMaster instance.

```typescript
disposeAllToasts(): void
```

---

### `disposeToastById(id: string)`
Disposes a specific toast item by its UUID.

```typescript
disposeToastById(id: string): void
```

#### Parameters
- `id` (`string`): The UUID of the toast item to dispose.

---

### `disposeToastsByScope(scope: string)`
Disposes all toast items associated with the given scope.

```typescript
disposeToastsByScope(scope: string): void
```

#### Parameters
- `scope` (`string`): The scope value of the toast items to dispose.

---

### `disposeToastsByVariant(variant: ToastMasterToastVariant)`
Disposes all toast items with the specified variant.

```typescript
disposeToastsByVariant(variant: ToastMasterToastVariant): void
```

#### Parameters
- `variant` ([`ToastMasterToastVariant`](#toastmastertoastvariant)): The variant of the toast items to dispose. Valid values are `'info'`, `'success'`, `'warning'`, `'error'`.

---

### `getToastById(id: string)`
Gets a toast item by its UUID.

```typescript
getToastById(id: string): ToastMasterToast | undefined
```

#### Parameters
- `id` (`string`): The UUID of the toast item to retrieve.

#### Returns
- `ToastMasterToast | undefined`: The toast item with the specified UUID, or `undefined` if no item is found.

---

### `getToastsByScope(scope: string)`
Gets a list of toast items by their scope value.

```typescript
getToastsByScope(scope: string): ToastMasterToast[]
```

#### Parameters
- `scope` (`string`): The scope value of the toast items to retrieve.

#### Returns
- `ToastMasterToast[]`: An array of toast items with the specified scope value.

---

### `createToast(options: ToastMasterToastOptions)`
Creates a new toast item and displays it in the global toast container.

```typescript
createToast(options: ToastMasterToastOptions): ToastMasterToast
```

#### Parameters
- `options` ([`ToastMasterToastOptions`](#toastmastertoastoptions)): The options for the toast item.

#### Returns
- `ToastMasterToast`: The newly created toast item.

---

### `createSuccessToast(successMessage: string)`
Creates a success toast with the specified success message.

```typescript
createSuccessToast(successMessage: string): ToastMasterToast
```

#### Parameters
- `successMessage` (`string`): The success message to display in the toast.

#### Returns
- `ToastMasterToast`: The newly created success toast item.

---

### `createWarningToast(warningMessage: string)`
Creates a warning toast with the specified warning message.

```typescript
createWarningToast(warningMessage: string): ToastMasterToast
```

#### Parameters
- `warningMessage` (`string`): The warning message to display in the toast.

#### Returns
- `ToastMasterToast`: The newly created warning toast item.

---

### `createErrorToast(errorMessage: string)`
Creates an error toast with the specified error message.

```typescript
createErrorToast(errorMessage: string): ToastMasterToast
```

#### Parameters
- `errorMessage` (`string`): The error message to display in the toast.

#### Returns
- `ToastMasterToast`: The newly created error toast item.

---

### `setParent(parent: HTMLElement)`
Moves the toast container to the specified parent element.

```typescript
setParent(parent: HTMLElement): void
```

#### Parameters
- `parent` (`HTMLElement`): The new parent element for the toast container.

---

### `setPositioning(positioning: ToastMasterToastPositioning)`
Sets the positioning options for the toast and updates the container.

```typescript
setPositioning(positioning: ToastMasterToastPositioning): void
```

#### Parameters
- `positioning` ([`ToastMasterToastPositioning`](#toastmastertoastpositioning)): The positioning options for the toast container.

---

## Types

### `ToastMasterToastVariant`
Represents the variant of a toast message.

```typescript
type ToastMasterToastVariant = 'info' | 'success' | 'warning' | 'error';
```

Possible values:
- `'info'`
- `'success'`
- `'warning'`
- `'error'`

---

### `ToastMasterToastOptions`
Represents the options for a toast item in ToastMaster.

```typescript
type ToastMasterToastOptions = {
  scope?: string;
  content: string;
  autohide?: number | boolean;
  variant?: ToastMasterToastVariant;
};
```

#### Properties
- **scope**: `string` (default: `''`) - The scope of the toast item.
- **content**: `string` (required) - The content of the toast item.
- **autohide**: `number | boolean` (default: `5000`) - Number of milliseconds before the toasts auto hide or a boolean for toggle. Zero or false means no autohide.
- **variant**: [`ToastMasterToastVariant`](#toastmastertoastvariant) (default: `'info'`) - The variant of the toast item.

---

### `ToastMasterToastPosition`
Represents the position of a toast message.

```typescript
type ToastMasterToastPosition = 'start' | 'center' | 'end';
```

Possible values:
- `'start'`
- `'center'`
- `'end'`

---

### `ToastMasterToastPositioning`
Represents the positioning of a toast.

```typescript
type ToastMasterToastPositioning = {
  horizontalAlignment?: ToastMasterToastPosition;
  verticalAlignment?: ToastMasterToastPosition;
  horizontalOffset?: 1 | 2 | 3 | 4 | 5;
  verticalOffset?: 1 | 2 | 3 | 4 | 5;
};
```

#### Properties
- **horizontalAlignment**: [`ToastMasterToastPosition`](#toastmastertoastposition) (default: `'end'`) - The horizontal position of the toast container.
- **verticalAlignment**: [`ToastMasterToastPosition`](#toastmastertoastposition) (default: `'end'`) - The vertical position of the toast container.
- **horizontalOffset**: `1 | 2 | 3 | 4 | 5` (default: `3`) - Top horizontal distance from the screen edge (Bootstrap class shortcut units).
- **verticalOffset**: `1 | 2 | 3 | 4 | 5` (default: `2`) - Top vertical distance from the screen edge (Bootstrap class shortcut units).
