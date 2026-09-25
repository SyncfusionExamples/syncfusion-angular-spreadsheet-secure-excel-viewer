import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SheetModel, SpreadsheetAllModule, SpreadsheetComponent as SyncfusionSpreadsheetComponent, getColumnHeaderText, ScrollSettingsModel, UsedRangeModel } from '@syncfusion/ej2-angular-spreadsheet';
import { closest, EventHandler } from '@syncfusion/ej2-base';
import { getStartEvent, SortOrder } from '@syncfusion/ej2-spreadsheet';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * SpreadsheetComponent - Encapsulates Syncfusion Spreadsheet with secure read-only mode
 *
 * This component provides:
 * - Secure read-only mode by default
 * - Granular control over editing, clipboard, and save operations
 * - Prevention of structural modifications (row/column/sheet operations)
 * - Mode toggle between read-only and edit modes
 * - Auto-loading on component initialization
 *
 * @component
 * @example
 * // Usage in template:
 * <app-spreadsheet></app-spreadsheet>
 */
@Component({
    selector: 'app-spreadsheet',
    standalone: true,
    imports: [SpreadsheetAllModule, SwitchModule, FormsModule, CommonModule],
    templateUrl: './spreadsheet.component.html',
    styleUrl: './spreadsheet.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpreadsheetComponent {
    /**
     * Reference to the underlying Syncfusion Spreadsheet instance
     * Allows direct access to Spreadsheet APIs when needed
     */
    @ViewChild('spreadsheet')
    public spreadsheetObj!: SyncfusionSpreadsheetComponent;

    /**
     * Reference to the underlying Syncfusion Switch instance
     */
    @ViewChild('readOnlySwitch')
    public switchObj!: SyncfusionSpreadsheetComponent;

    public scrollSettings: ScrollSettingsModel = { isFinite: true };

    /**
     * Controls whether the Spreadsheet is in read-only mode
     * - true (default): Read-only mode with all restrictions enabled
     * - false: Edit mode allowing cell editing, clipboard, and all Spreadsheet operations
     */
    public isReadOnly: boolean = true;

    /**
     * Handles Spreadsheet creation event
     * Loads the default sample file into the Spreadsheet on component creation
     *
     * @remarks
     * This is called when the Spreadsheet component is fully created and ready.
     * It triggers file loading from the CDN resource for demo purpose.
     */
    public createdHandler(): void {
        // Load default sample file on Spreadsheet creation
        this.loadFile('https://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx');
    }

    /**
     * Loads an Excel file from a remote URL into the Spreadsheet.
     * You can fetch the Excel file from your server and use our Open API to load it into Spreadsheet.
     *
     * This method fetches the file as a blob and converts it to a File object
     * for opening in the Spreadsheet component.
     *
     * @param filePath - URL path to the Excel file to load
     *
     * @remarks
     * - Performs async fetch operation
     * - Converts blob response to File object
     * - Opens file in Spreadsheet via open() API
     */
    private loadFile(filePath: string): void {
        fetch(filePath) // Fetch the remote URL
            .then((response) => {
                response.blob().then((fileBlob) => { // Convert Excel file to blob
                    const file = new File([fileBlob], 'Sample.xlsx'); // Convert blob to File object
                    this.spreadsheetObj!.open({ file: file }); // Open the file in Spreadsheet
                })
            });
    }

    /**
     * Handles Spreadsheet file open completion event
     * Applies read-only mode configuration after the file has been successfully loaded
     *
     * @remarks
     * This is called after the Spreadsheet has finished opening/loading a file.
     * It ensures that all security configurations (read-only mode, column protection,
     * workbook protection, and toolbar restrictions) are applied to the newly loaded content.
     */
    public openCompleteHandler(): void {
        // Configure spreadsheet to read-only mode after file is loaded
        this.configureSpreadsheetMode();
    }

    /**
     * Configures the Spreadsheet mode (read-only or edit)
     *
     * This is the single source of truth for all mode-related configuration.
     * It applies the current `isReadOnly` state to all relevant Syncfusion APIs:
     * - Column read-only protection
     * - Workbook protection (prevent sheet operations)
     * - Toolbar item enable/disable states
     *
     * In read-only mode (isReadOnly = true):
     * - All columns are set to read-only
     * - Workbook is protected (prevents rename/duplicate/delete sheets)
     * - Editing toolbar items are disabled
     * - Save functionality is disabled
     *
     * In edit mode (isReadOnly = false):
     * - All columns become editable
     * - Workbook protection is lifted
     * - Editing toolbar items are enabled
     * - Save functionality is enabled
     *
     * @remarks
     * - Called during component initialization (openCompleteHandler)
     * - Called when mode toggle changes (onModeToggleChange)
     * - Updates column states, workbook protection, and toolbar visibility in sequence
     *
     * @private
     */
    private configureSpreadsheetMode(): void {
        // Apply configuration to spreadsheet instance if it exists
        if (this.spreadsheetObj) {
            // Configure save action based on read-only state
            this.spreadsheetObj.allowSave = !this.isReadOnly;
            this.spreadsheetObj.dataBind();
            // Configure column read-only protection
            this.updateColumnsState();
            // Configure workbook protection to prevent sheet structural changes
            this.updateWorkbookState();
            // Configure ribbon toolbar based on the read-only mode
            this.updateRibbonToolbarState();
        }
    }

    /**
     * Updates column read-only protection state for all sheets
     *
     * Iterates through all sheets and applies the current `isReadOnly` state
     * to all columns in the used range. Also ensures sheet row/col counts
     * accommodate all data.
     *
     * @remarks
     * - Determines the last used column dynamically from sheet.usedRange
     * - Applies read-only protection from column A to the last used column
     * - Updates sheet row/col counts to ensure all data is within bounds
     *
     * @private
     */
    private updateColumnsState(): void {
        this.spreadsheetObj.sheets.forEach((sheet: SheetModel, index: number) => {
            // Get the last used column name, defaulting to column 100
            const endColumnName: string = getColumnHeaderText(sheet.usedRange.colIndex > 99 ? sheet.usedRange.colIndex + 1 : 100);
            // Apply the current isReadOnly state to all used columns
            this.spreadsheetObj.setRangeReadOnly(this.isReadOnly, `A:${endColumnName}`, index);
            // Update sheet row/col counts to accommodate all data
            this.setSheetLastRowColCount(sheet);
        });
    }

    /**
     * Updates workbook protection state to prevent structural modifications
     *
     * Sets the workbook protection flag to match the read-only state:
     * - When isReadOnly = true: Workbook is protected, preventing sheet operations
     * - When isReadOnly = false: Workbook is unprotected, allowing sheet operations
     *
     * Protected operations prevented include: rename sheet, duplicate sheet, delete sheet, move sheet
     *
     * @remarks
     * Calls dataBind() to ensure protection state is applied immediately
     *
     * @private
     */
    private updateWorkbookState(): void {
        this.spreadsheetObj.isProtected = this.isReadOnly;
        this.spreadsheetObj.dataBind();
    }

    /**
     * Updates ribbon toolbar item states based on read-only mode
     *
     * Selectively enables or disables toolbar items across multiple ribbon tabs
     * to reflect the current mode:
     * - Home tab: All 32 toolbar items (except in read-only mode)
     * - Insert tab: Items 0-1 (except in read-only mode)
     * - Formulas tab: Items 0-5 (except in read-only mode)
     * - Data tab: Items 1-3 (except in read-only mode)
     * - Review tab: Items 1-2 (except in read-only mode)
     *
     * In read-only mode, these items are disabled to prevent modifications.
     * In edit mode, these items are enabled to allow full functionality.
     *
     * @remarks
     * - Item indices correspond to toolbar button positions in Syncfusion Spreadsheet
     * - Read-only mode enables view-only operations (filter, sort, etc.)
     * - Edit mode enables all data manipulation operations
     *
     * @private
     */
    private updateRibbonToolbarState(): void {
        // Home tab: Enable/disable all 32 toolbar items based on mode
        this.spreadsheetObj.enableToolbarItems('Home', Array.from({ length: 32 }, (_, i) => i), !this.isReadOnly);
        // Insert tab: Enable/disable items 0-1 based on mode
        this.spreadsheetObj.enableToolbarItems('Insert', [0, 1], !this.isReadOnly);
        // Formulas tab: Enable/disable items 0-5 based on mode
        this.spreadsheetObj.enableToolbarItems('Formulas', [0, 1, 2, 3, 4, 5], !this.isReadOnly);
        // Data tab: Enable/disable items 1-3 based on mode
        this.spreadsheetObj.enableToolbarItems('Data', [1, 2, 3], !this.isReadOnly);
        // Review tab: Enable/disable items 1-2 based on mode
        this.spreadsheetObj.enableToolbarItems('Review', [1, 2], !this.isReadOnly);
    }

    /**
     * Updates sheet row and column counts based on used range
     *
     * Ensures that the sheet's row and column counts accommodate all data
     * by comparing the used range with default limits (100 rows/cols).
     * If data extends beyond the default limits, the sheet dimensions are expanded.
     *
     * @param sheet - The SheetModel to update
     *
     * @remarks
     * - Uses setSheetPropertyOnMute() to apply changes silently without triggering change events
     * - Only updates if used range exceeds the default 100-row or 100-column limit
     * - Prevents data truncation when opening files with extended ranges
     *
     * @private
     */
    private setSheetLastRowColCount(sheet: SheetModel): void {
        const usedRange: UsedRangeModel = sheet.usedRange as UsedRangeModel;
        // Expand row count if used range extends beyond default 100 rows
        if (usedRange.rowIndex + 1 > 100) {
            this.spreadsheetObj.setSheetPropertyOnMute(sheet, 'rowCount', usedRange.rowIndex + 1);
        }
        // Expand column count if used range extends beyond default 100 columns
        if (usedRange.colIndex + 1 > 100) {
            this.spreadsheetObj.setSheetPropertyOnMute(sheet, 'colCount', usedRange.colIndex + 1);
        }
    }

    /**
     * Handles mode toggle switch change event
     * Called whenever the read-only/edit mode toggle switch changes state
     * Updates the `isReadOnly` property and applies the new mode configuration
     *
     * @param event - Change event from the Syncfusion Switch component
     * @param event.checked - New switch state (true = read-only/view mode, false = edit mode)
     *
     * @remarks
     * - Updates isReadOnly property to match switch state
     * - Immediately calls configureSpreadsheetMode() to apply all security changes
     * - Changes affect columns, workbook protection, and toolbar states
     */
    public onModeToggleChange(event: any): void {
        this.isReadOnly = event.checked;
        // Apply new mode configuration based on toggle state
        this.configureSpreadsheetMode();
    }

    /**
     * Handles dialog before open event
     * Prevents the read-only alert dialog from displaying
     *
     * @param args - Dialog event arguments
     * @param args.dialogName - Name of the dialog being opened
     *
     * @remarks
     * Cancels the 'ReadOnlyAlertDialog' to avoid showing duplicate read-only warnings
     * since the UI already displays mode status through the mode indicator and description
     */
    public dialogBeforeOpenHandler(args: any): void {
        if (args.dialogName === 'ReadOnlyAlertDialog') {
            args.cancel = true; // Cancel the read-only alert dialog
        }
    }

    /**
     * Handles file menu before open event
     * Disable the Print menu option
     *
     * @param args - File menu event arguments
     * @param args.dialogName - Name of the dialog being opened
     *
     * @remarks
     * Update the Print file menu option state based on read only mode
     */
    public fileMenuBeforeOpenHandler(args: any): void {
        this.spreadsheetObj.enableFileMenuItems(['Print'], !this.isReadOnly);
    }

    /**
     * Handles context menu before open event
     * Customizes available context menu items based on read-only mode
     *
     * In read-only mode:
     * - Content menu: Enable Filter/Sort, disable Cut/Copy/Custom Sort
     * - Column/Row header menus: Disabled completely to prevent structural changes
     *
     * In edit mode:
     * - All context menu items are available
     *
     * @param args - Context menu event arguments
     * @param args.target - Where context menu was triggered ('Content', 'ColumnHeader', 'RowHeader')
     *
     * @remarks
     * - Maintains read-only restrictions by disabling structural menu items
     * - Allows view operations (Filter, Sort) even in read-only mode for data exploration
     */
    public contextMenuBeforeOpenHandler(args: any): void {
        if (this.isReadOnly) {
            if (args.target === 'Content') {
                // In read-only mode, allow Filter/Sort but disable Cut/Copy
                this.spreadsheetObj.enableContextMenuItems(['Filter', 'Sort'], true, false);
                this.spreadsheetObj.enableContextMenuItems(['Cut', 'Copy', 'Custom Sort...'], false, false);
                this.spreadsheetObj.removeContextMenuItems(['Custom Sort...']);
                this.spreadsheetObj.enableContextMenuItems(['Cut', 'Copy', 'Custom Sort...'], false, false);
            } else if (args.target === 'ColumnHeader' || args.target === 'RowHeader') {
                // Prevent column/row operations in read-only mode
                args.cancel = true;
            }
        }
    }

    /**
     * Handles context menu item selection
     * Allows sorting operations in read-only mode as a view-only operation
     *
     * @param args - Context menu item select event arguments
     * @param args.item - Selected menu item
     * @param args.item.text - Text of the selected menu item ('Ascending', 'Descending', etc.)
     *
     * @remarks
     * - In read-only mode, permits Ascending/Descending sort as non-destructive data exploration
     * - Sort operations do not modify underlying data, only the view
     */
    public contextMenuItemSelectHandler(args: any): void {
        if (this.isReadOnly && (args.item.text === 'Ascending' || args.item.text === 'Descending')) {
            // Apply sort in read-only mode as a view-only operation
            this.spreadsheetObj.sort({ sortDescriptors: { order: args.item.text } });
        }
    }

    /**
     * Handles filter menu click events during sorting in read-only mode
     * Processes Ascending/Descending sort button clicks from filter UI
     *
     * @param event - DOM click event
     * @param event.target - HTML element that was clicked
     *
     * @remarks
     * - Detects sort direction from CSS classes on the clicked element
     * - Applies sort operation via Spreadsheet API
     * - Removes the event handler after sort is applied or interaction ends
     * - Used specifically for filter-based sorting in read-only mode
     */
    public filterMenuClickHandler(event: any): void {
        let sortOrder: SortOrder;
        // Detect ascending sort from CSS classes
        if (event.target.classList.contains('e-filter-sortasc') || event.target.classList.contains('e-sort-asc')) {
            sortOrder = 'Ascending';
        }
        // Detect descending sort from CSS classes
        else if (event.target.classList.contains('e-filter-sortdesc') || event.target.classList.contains('e-sort-desc')) {
            sortOrder = 'Descending';
        }
        // Apply sort if direction was detected, then remove event handler
        if (sortOrder) {
            this.spreadsheetObj.sort({ sortDescriptors: { order: sortOrder } });
            EventHandler.remove(this.spreadsheetObj.element, getStartEvent(), this.filterMenuClickHandler);
        }
        // Remove event handler when clicking outside filter menu
        else if (!closest(event.target, '.e-excelfilter') || event.target.classList.contains('e-btn')) {
            EventHandler.remove(this.spreadsheetObj.element, getStartEvent(), this.filterMenuClickHandler);
        }
    }

    /**
     * Handles all Spreadsheet action begin events
     * Enforces read-only mode restrictions by cancelling disallowed operations
     *
     * In read-only mode:
     * - Cancels copy and cut operations
     * - Attaches filter menu handler for sorting functionality
     *
     * Structural modifications (row insert/delete, column insert/delete, sheet operations)
     * are prevented via column read-only protection and workbook protection set in configureSpreadsheetMode()
     *
     * @param event - Action begin event from Spreadsheet
     * @param event.action - Action type ('copy', 'cut', etc.)
     * @param event.requestType - Request type ('filterchoicerequest', etc.)
     * @param event.args - Additional arguments including cancel flag
     *
     * @remarks
     * - Copy/cut are blocked to prevent unauthorized data extraction
     * - Filter menu handler is attached to enable sorting in read-only mode
     * - Works in conjunction with column protection and workbook protection
     */
    public onActionBegin(event: any): void {
        if (this.isReadOnly) {
            // Prevent copy and cut operations in read-only mode
            if (event.action === 'copy' || event.action === 'cut') {
                event.args.cancel = true;
            }
            // Allow sort operations through filter menu in read-only mode
            else if (event.requestType === 'filterchoicerequest') {
                EventHandler.add(this.spreadsheetObj.element, getStartEvent(), this.filterMenuClickHandler, this);
            }
        }
    }
}
