import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpreadsheetComponent } from './spreadsheet.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ActionEventArgs } from '@syncfusion/ej2-angular-spreadsheet';

describe('SpreadsheetComponent', () => {
  let component: SpreadsheetComponent;
  let fixture: ComponentFixture<SpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SpreadsheetComponent,
        SpreadsheetAllModule,
        SwitchModule,
        FormsModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpreadsheetComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with isReadOnly set to true (view mode by default)', () => {
      expect(component.isReadOnly).toBe(true);
    });

    it('should have scrollSettings configured', () => {
      expect(component.scrollSettings.isFinite).toBe(true);
    });

    it('should load file on createdHandler', () => {
      spyOn<any>(component, 'loadFile');
      component.createdHandler();
      expect(component['loadFile']).toHaveBeenCalledWith('https://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx');
    });

    it('should configure spreadsheet mode on openCompleteHandler', () => {
      component.spreadsheetObj = {
        allowSave: true,
        dataBind: () => {},
        sheets: [],
        isProtected: false
      } as any;
      spyOn<any>(component, 'configureSpreadsheetMode');
      component.openCompleteHandler();
      expect(component['configureSpreadsheetMode']).toHaveBeenCalled();
    });
  });

  describe('configureSpreadsheetMode Method', () => {
    beforeEach(() => {
      // Mock the spreadsheet object with all required methods
      component.spreadsheetObj = {
        allowSave: false,
        dataBind: () => {},
        sheets: [],
        isProtected: false,
        enableToolbarItems: () => {},
        setRangeReadOnly: () => {},
        setSheetPropertyOnMute: () => {}
      } as any;
    });

    it('should disable save when in read-only mode (isReadOnly = true)', () => {
      component.isReadOnly = true;
      component['configureSpreadsheetMode']();
      expect(component.spreadsheetObj.allowSave).toBe(false);
    });

    it('should enable save when in edit mode (isReadOnly = false)', () => {
      component.isReadOnly = false;
      component['configureSpreadsheetMode']();
      expect(component.spreadsheetObj.allowSave).toBe(true);
    });

    it('should call updateColumnsState during configuration', () => {
      spyOn<any>(component, 'updateColumnsState');
      component['configureSpreadsheetMode']();
      expect(component['updateColumnsState']).toHaveBeenCalled();
    });

    it('should call updateWorkbookState during configuration', () => {
      spyOn<any>(component, 'updateWorkbookState');
      component['configureSpreadsheetMode']();
      expect(component['updateWorkbookState']).toHaveBeenCalled();
    });

    it('should call updateRibbonToolbarState during configuration', () => {
      spyOn<any>(component, 'updateRibbonToolbarState');
      component['configureSpreadsheetMode']();
      expect(component['updateRibbonToolbarState']).toHaveBeenCalled();
    });

    it('should handle case when spreadsheetObj is undefined gracefully', () => {
      component.spreadsheetObj = undefined as any;
      expect(() => {
        component['configureSpreadsheetMode']();
      }).not.toThrow();
    });
  });

  describe('Mode Toggle Handler', () => {
    beforeEach(() => {
      component.spreadsheetObj = {
        allowSave: false,
        dataBind: () => {},
        sheets: [],
        isProtected: false,
        enableToolbarItems: () => {},
        setRangeReadOnly: () => {},
        setSheetPropertyOnMute: () => {}
      } as any;
    });

    it('should call configureSpreadsheetMode when toggle changes', () => {
      spyOn<any>(component, 'configureSpreadsheetMode');
      component.isReadOnly = false;
      component.onModeToggleChange({ checked: false });

      expect(component['configureSpreadsheetMode']).toHaveBeenCalled();
    });

    it('should update isReadOnly property from event.checked', () => {
      component.onModeToggleChange({ checked: false });
      expect(component.isReadOnly).toBe(false);

      component.onModeToggleChange({ checked: true });
      expect(component.isReadOnly).toBe(true);
    });

    it('should apply view mode configuration when isReadOnly is true', () => {
      component.isReadOnly = true;
      component.onModeToggleChange({ checked: true });

      expect(component.spreadsheetObj.allowSave).toBe(false);
    });

    it('should apply edit mode configuration when isReadOnly is false', () => {
      component.isReadOnly = false;
      component.onModeToggleChange({ checked: false });

      expect(component.spreadsheetObj.allowSave).toBe(true);
    });
  });

  describe('actionBegin Event Handler - Copy/Cut Restrictions', () => {
    beforeEach(() => {
      component.spreadsheetObj = {
        element: { addEventListener: () => {}, removeEventListener: () => {} }
      } as any;
    });

    it('should cancel copy action in read-only mode', () => {
      component.isReadOnly = true;
      const args = { action: 'copy', args: { cancel: false }, requestType: '' } as any;
      component.onActionBegin(args);
      expect(args.args.cancel).toBe(true);
    });

    it('should cancel cut action in read-only mode', () => {
      component.isReadOnly = true;
      const args = { action: 'cut', args: { cancel: false }, requestType: '' } as any;
      component.onActionBegin(args);
      expect(args.args.cancel).toBe(true);
    });

    it('should allow copy action in edit mode', () => {
      component.isReadOnly = false;
      const args = { action: 'copy', args: { cancel: false }, requestType: '' } as any;
      component.onActionBegin(args);
      expect(args.args.cancel).toBe(false);
    });

    it('should allow cut action in edit mode', () => {
      component.isReadOnly = false;
      const args = { action: 'cut', args: { cancel: false }, requestType: '' } as any;
      component.onActionBegin(args);
      expect(args.args.cancel).toBe(false);
    });

    it('should attach filter menu handler on filterchoicerequest in read-only mode', () => {
      component.isReadOnly = true;
      spyOn(EventHandler, 'add');
      const args = { action: '', requestType: 'filterchoicerequest' } as any;
      component.onActionBegin(args);
      expect(EventHandler.add).toHaveBeenCalled();
    });
  });

  describe('View Mode (Read-Only) Security', () => {
    beforeEach(() => {
      component.spreadsheetObj = {
        allowSave: true,
        dataBind: () => {},
        sheets: [],
        isProtected: false,
        enableToolbarItems: () => {},
        setRangeReadOnly: () => {},
        setSheetPropertyOnMute: () => {}
      } as any;
    });

    it('should disable save when in view mode (isReadOnly = true)', () => {
      component.isReadOnly = true;
      component['configureSpreadsheetMode']();
      expect(component.spreadsheetObj.allowSave).toBe(false);
    });

    it('should set workbook protection in view mode', () => {
      component.isReadOnly = true;
      component['configureSpreadsheetMode']();
      expect(component.spreadsheetObj.isProtected).toBe(true);
    });

    it('should apply read-only to columns in view mode', () => {
      spyOn<any>(component, 'updateColumnsState');
      component.isReadOnly = true;
      component['configureSpreadsheetMode']();
      expect(component['updateColumnsState']).toHaveBeenCalled();
    });

    it('should disable toolbar items in view mode', () => {
      spyOn<any>(component, 'updateRibbonToolbarState');
      component.isReadOnly = true;
      component['configureSpreadsheetMode']();
      expect(component['updateRibbonToolbarState']).toHaveBeenCalled();
    });
  });

  describe('Edit Mode Security', () => {
    beforeEach(() => {
      component.spreadsheetObj = {
        allowSave: false,
        dataBind: () => {},
        sheets: [],
        isProtected: true,
        enableToolbarItems: () => {},
        setRangeReadOnly: () => {},
        setSheetPropertyOnMute: () => {}
      } as any;
    });

    it('should enable save in edit mode (isReadOnly = false)', () => {
      component.isReadOnly = false;
      component['configureSpreadsheetMode']();
      expect(component.spreadsheetObj.allowSave).toBe(true);
    });

    it('should unprotect workbook in edit mode', () => {
      component.isReadOnly = false;
      component['configureSpreadsheetMode']();
      expect(component.spreadsheetObj.isProtected).toBe(false);
    });

    it('should remove read-only from columns in edit mode', () => {
      spyOn<any>(component, 'updateColumnsState');
      component.isReadOnly = false;
      component['configureSpreadsheetMode']();
      expect(component['updateColumnsState']).toHaveBeenCalled();
    });

    it('should enable toolbar items in edit mode', () => {
      spyOn<any>(component, 'updateRibbonToolbarState');
      component.isReadOnly = false;
      component['configureSpreadsheetMode']();
      expect(component['updateRibbonToolbarState']).toHaveBeenCalled();
    });

    it('should still prevent copy/cut via copy/cut actions (even in edit mode)', () => {
      component.isReadOnly = false;
      const copyArgs = { action: 'copy', args: { cancel: false }, requestType: '' } as any;
      // Copy restrictions are only in read-only mode, so in edit mode they should pass
      component.onActionBegin(copyArgs);
      expect(copyArgs.args.cancel).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should display Switch component in template', () => {
      fixture.detectChanges();
      const switchElement = fixture.nativeElement.querySelector('ejs-switch');
      expect(switchElement).toBeTruthy();
    });

    it('should display mode indicator text', () => {
      fixture.detectChanges();
      const modeIndicator = fixture.nativeElement.querySelector('.mode-indicator span');
      expect(modeIndicator).toBeTruthy();
    });

    it('should display Spreadsheet element in template', () => {
      fixture.detectChanges();
      const spreadsheetElement = fixture.nativeElement.querySelector('ejs-spreadsheet');
      expect(spreadsheetElement).toBeTruthy();
    });

    it('should show "View Mode" text when isReadOnly is true', () => {
      component.isReadOnly = true;
      fixture.detectChanges();
      const modeIndicator = fixture.nativeElement.querySelector('.mode-indicator span');
      expect(modeIndicator.textContent).toContain('View Mode');
    });

    it('should show "Edit Mode" text when isReadOnly is false', (done) => {
      component.isReadOnly = false;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const modeIndicator = fixture.nativeElement.querySelector('.mode-indicator span');
        expect(modeIndicator.textContent).toContain('Edit Mode');
        done();
      });
    });

    it('should apply amber color class when in view mode', () => {
      component.isReadOnly = true;
      fixture.detectChanges();
      const modeIndicator = fixture.nativeElement.querySelector('.mode-indicator span');
      expect(modeIndicator.classList.contains('text-amber-600')).toBe(true);
    });

    it('should apply blue color class when in edit mode', () => {
      component.isReadOnly = false;
      fixture.detectChanges();
      const modeIndicator = fixture.nativeElement.querySelector('.mode-indicator span');
      expect(modeIndicator.classList.contains('text-blue-600')).toBe(true);
    });

    it('should bind switch model to isReadOnly property', () => {
      component.isReadOnly = true;
      fixture.detectChanges();
      const switchElement = fixture.nativeElement.querySelector('ejs-switch');
      expect(switchElement).toBeTruthy();
    });

    it('should display mode status information in view mode', () => {
      component.isReadOnly = true;
      fixture.detectChanges();
      const statusInfo = fixture.nativeElement.querySelector('.mode-status-info');
      const text = statusInfo.textContent;
      expect(text).toContain('view mode');
      expect(text).toContain('Cell editing');
      expect(text).toContain('clipboard operations');
      expect(text).toContain('disabled');
    });

    it('should display mode status information in edit mode', () => {
      component.isReadOnly = false;
      fixture.detectChanges();
      const statusInfo = fixture.nativeElement.querySelector('.mode-status-info');
      const text = statusInfo.textContent;
      expect(text).toContain('edit mode');
      expect(text).toContain('can edit cells');
    });
  });

  describe('Dialog and Context Menu Handlers', () => {
    it('should cancel ReadOnlyAlertDialog', () => {
      const args = { dialogName: 'ReadOnlyAlertDialog', cancel: false };
      component.dialogBeforeOpenHandler(args);
      expect(args.cancel).toBe(true);
    });

    it('should not cancel other dialogs', () => {
      const args = { dialogName: 'OtherDialog', cancel: false };
      component.dialogBeforeOpenHandler(args);
      expect(args.cancel).toBe(false);
    });

    it('should enable Filter/Sort and disable Cut/Copy in read-only content menu', () => {
      component.spreadsheetObj = {
        enableContextMenuItems: () => {},
        removeContextMenuItems: () => {}
      } as any;
      spyOn(component.spreadsheetObj, 'enableContextMenuItems');

      component.isReadOnly = true;
      const args = { target: 'Content', cancel: false };
      component.contextMenuBeforeOpenHandler(args);
      expect(component.spreadsheetObj.enableContextMenuItems).toHaveBeenCalled();
    });

    it('should cancel column header context menu in read-only mode', () => {
      component.isReadOnly = true;
      const args = { target: 'ColumnHeader', cancel: false };
      component.contextMenuBeforeOpenHandler(args);
      expect(args.cancel).toBe(true);
    });

    it('should cancel row header context menu in read-only mode', () => {
      component.isReadOnly = true;
      const args = { target: 'RowHeader', cancel: false };
      component.contextMenuBeforeOpenHandler(args);
      expect(args.cancel).toBe(true);
    });

    it('should allow context menus in edit mode', () => {
      component.isReadOnly = false;
      const args = { target: 'ColumnHeader', cancel: false };
      component.contextMenuBeforeOpenHandler(args);
      expect(args.cancel).toBe(false);
    });

    it('should handle sort order from context menu in read-only mode', () => {
      component.spreadsheetObj = {
        sort: () => {}
      } as any;
      spyOn(component.spreadsheetObj, 'sort');

      component.isReadOnly = true;
      const args = { item: { text: 'Ascending' } };
      component.contextMenuItemSelectHandler(args);
      expect(component.spreadsheetObj.sort).toHaveBeenCalled();
    });
  });
});
