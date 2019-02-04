# ToggleButtonGroup

<docs-source-example example="DefaultToggleButtonExampleComponent"></docs-source-example>

## Imports

You have to import the `DtToggleButtonGroupModule` when you want to use the `<dt-toggle-button-group>`:

```typescript
@NgModule({
  imports: [
    DtToggleButtonGroupModule,
  ],
})
class MyModule {}
```

## Initialization

The `<dt-toggle-button-group>` acts as a grouping container for all `<dt-toggle-button-item>` components. A `<dt-toggle-button-item>` cannot function without a group as it is the group that is managing the toggling state. The group can hold any content and is not limited to `dt-toggle-button-item`s.

The `<dt-toggle-button-item>` can hold any content which will be rendered into the right hand side of the component. It also has a special selection for the icon on the left hand side: 
* `<dt-toggle-button-item-icon>` should be filled with a `dt-icon` which will be styled and rendered according to the toggle-button-group container.

## Options & Properties

### Toggle button group

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectedItem` | `DtToggleButtonItem<T>` | - | Getter to access the currently selected `DtToggleButtonItem<T>` instance or `null` if none is selected. |
| `value` | `<T>` | null | Getter to access the currently selected value. |
| `@Output() change` | `EventEmitter<DtToggleButtonChange<T>>` | - | EventEmitter that fires every time the selection changes. `DtToggleButtonChange` is an interface for the following object signature: `{ source: DtToggleButtonItem<T>, value: T | null, isUserInput: boolean }`. |


### Toggle button item

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() selected` | `boolean` | `false` | Whether or not the `DtToggleButtonItem` is selected or not. 
| `@Input() value` | `<T>` | `null` | Value of the `DtToggleButtonItem`. |
| `@Input() tabIndex` | `number` | 0 | Sets the tabIndex of the `DtToggleButtonItem`. If the item is disabled, tabIndex will be set to -1 to remove it from the keyboard navigation. |
| `@Input() disabled` | `boolean` | `false` | Disables the `DtToggleButtonItem`. |
| `@Input() aria-label` | `string` | - | String that will be applied as an aria label on the `DtToggleButtonItem`. | 
| `@Input() aria-labelledby` | `string` | - | One or more DOM element ids that label the `DtToggleButtonItem`. If multiple values are given, please use a space separated list. |
| `@Input() aria-describedby` | `string` | - |  One DOM element id that describe the actions taken by selecting the `DtToggleButtonItem`. |
| `@Output() change` | `EventEmitter<DtToggleButtonChange<T>>` | - | EventEmitter that fires when the selection of the `DtToggleButtonItem` changes. |
| `focus()` | `function` | - | Function to programatically call focus on a `DtToggleButtonItem`. |
| `select()` | `function` | - | Function to programmatically select on a `DtToggleButtonItem`. |
| `deselect()` | `function` | - | Function to programmatically deselect on a `DtToggleButtonItem`. |

## Examples

<docs-source-example example="DynamicItemsToggleButtonExampleComponent"></docs-source-example>