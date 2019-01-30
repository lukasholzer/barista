import { DtCell, DtColumnDef } from '@dynatrace/angular-components/table';
import { ChangeDetectionStrategy, ViewEncapsulation, Renderer2, ElementRef, SkipSelf, Component, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { DtTreeTableRow } from './tree-table-row';
import { DtTreeControl } from '@dynatrace/angular-components/core';
import { DtTreeTable } from './tree-table';

/** Cell template container that adds the right classes, role, and handles indentation */
@Component({
  selector: 'dt-tree-table-toggle-cell',
  templateUrl: 'tree-table-toggle-cell.html',
  styleUrls: ['tree-table-toggle-cell.scss'],
  host: {
    class: 'dt-cell dt-tree-toggle-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  exportAs: 'dtTreeTableToggleCell',
})
export class DtTreeTableToggleCell<T> extends DtCell {
  /** The aria label for the toggle button */
  @Input('aria-label') ariaLabel: string;

  /** @internal Wether the row is expanded */
  get _isExpanded(): boolean {
    return this._treeControl.isExpanded((this._row as DtTreeTableRow<T>).data);
  }
  /** @internal Wether the row is expandable */
  get _expandable(): boolean {
    return this._treeControl.isExpandable((this._row as DtTreeTableRow<T>).data);
  }

  /** @internal the treecontrol registered on the tree-table */
  get _treeControl(): DtTreeControl<T> {
    return this._treeTable.treeControl;
  }

  /** @internal The rowdata for the parent row */
  get _rowData(): T {
    return (this._row as DtTreeTableRow<T>).data;
  }

  private _indent = 16;

  @ViewChild('wrapper') wrapperElement: ElementRef;

  constructor(
    public _columnDef: DtColumnDef,
    public _changeDetectorRef: ChangeDetectorRef,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    @SkipSelf() private _treeTable: DtTreeTable<T>
  ) {
    super(_columnDef, _changeDetectorRef, _renderer, _elementRef);
  }

  ngAfterViewInit(): void {
    this._setPadding();
  }

  /** The padding indent value for the tree node. Returns a padding left and a padding right value */
  private _paddingIndent(): number | null {
    const treeControl = this._treeTable.treeControl;
    const row = this._row as DtTreeTableRow<T>;
    const nodeLevel = (row.data && treeControl.getLevel)
      ? treeControl.getLevel(row.data)
      : null;
    return nodeLevel ? nodeLevel * this._indent : null;
  }
  /** Sets the padding on the cell */
  private _setPadding(): void {
    const padding = this._paddingIndent();
    this._renderer.setStyle(this.wrapperElement.nativeElement, 'padding-left', `${padding}px`);
  }
}