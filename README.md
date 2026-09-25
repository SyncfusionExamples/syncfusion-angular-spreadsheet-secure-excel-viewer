# Syncfusion Angular Spreadsheet - Secure Excel Viewer

A production-ready Angular application demonstrating a **secure, read-only Excel viewer** with **toggle-based edit mode** using [Syncfusion Angular Spreadsheet](https://www.syncfusion.com/angular-components/angular-spreadsheet) component. Perfect for implementing compliant data viewing solutions with granular security controls.

## 🎯 Features

- **Secure View Mode (Read-Only)** - Default mode with editing and modification restrictions enabled.
  - Cell editing actions such as edit, delete, clear, autofill, and other content modification operations disabled
  - Clipboard operations (cut, copy, and paste) restricted  
  - Save functionality disabled
  - Rows, columns, and sheets protected from structural changes

- **Flexible Edit Mode** - Toggle to allow authorized users to modify workbook content and structure.
  - Edit cell values and formulas
  - Perform clipboard operations (cut, copy, and paste)
  - Save workbook changes
  - Insert, delete, and modify rows, columns, and sheets

- **Mode Toggle Switch** - Syncfusion Switch component for seamless mode switching
  - Real-time visual indicators (View Mode / Edit Mode)
  - Automatic UI updates based on mode
  - Accessibility-compliant toggle control

- **Security Controls**
  - Column-level read-only protection
  - Workbook protection (prevents sheet operations)
  - Contextual menu restrictions
  - Toolbar item state management

## 📋 Tech Stack

- **Angular**: 21.2.0 (Standalone Components)
- **Syncfusion EJ2**: 34.2.x (Spreadsheet & Button components)
- **Styling**: Tailwind CSS 3
- **Build Tool**: Angular CLI 21.2.24
- **Testing**: Vitest

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18+ LTS
- **npm**: 8+
- **Angular CLI**: 21.x

```bash
# Check versions
node --version
npm --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SyncfusionExamples/syncfusion-angular-spreadsheet-secure-excel-viewer.git
   cd syncfusion-angular-spreadsheet-secure-excel-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm start
   ```
   Application will be available at `http://localhost:4200/`

4. **Build for production**
   ```bash
   npm run build
   ```
   Output will be in `dist/spreadsheet-app/`

## 📁 Project Structure

```
src/
├── app/
│   ├── spreadsheet/              # Spreadsheet component module
│   │   ├── spreadsheet.component.ts       # Component logic with security controls
│   │   ├── spreadsheet.component.html     # Template with toggle & spreadsheet
│   │   ├── spreadsheet.component.css      # Component styling
│   │   ├── spreadsheet.component.spec.ts  # Unit tests
│   │   └── index.ts                       # Public API export
│   ├── app.ts                   # Root component
│   └── app.routes.ts            # Route configuration
├── styles.css                   # Global styles & theme imports
└── index.html                   # Entry point
```

## 🔐 Security Model

### View Mode (Default - isReadOnly = true)
- **Cells**: Read-only, no editing allowed
- **Clipboard**: Copy/paste disabled
- **Save**: Save button disabled
- **Sheets**: Cannot rename, duplicate, or delete
- **Toolbar**: Editing tools disabled
- **Allowed Operations**: Filter, sort (view-only)

### Edit Mode (isReadOnly = false)
- **Cells**: Full editing enabled
- **Clipboard**: Copy/paste enabled
- **Save**: Save functionality enabled
- **Sheets**: Protected (structural changes still prevented)
- **Toolbar**: All editing tools enabled
- **Protected**: Row/column insert/delete operations blocked

## 🎮 How to Use

1. **View Spreadsheet**: App opens in View Mode
2. **Toggle to Edit**: Use the switch in the control section to enable editing
3. **Toggle Back to View**: Switch again to return to secure view mode
4. **Observe Mode Changes**: 
   - Mode indicator changes color (amber for View, blue for Edit)
   - Status message updates with current restrictions
   - Toolbar items enable/disable dynamically

## 🔧 Configuration

### Loading Custom Excel Files

Modify the file URL in `spreadsheet.component.ts`:

```typescript
// In createdHandler() method
this.loadFile('https://your-cdn.com/your-file.xlsx');
```

### Customizing Security Restrictions

Edit `configureSpreadsheetMode()` in `spreadsheet.component.ts`:

```typescript
private configureSpreadsheetMode(): void {
  if (this.spreadsheetObj) {
    this.spreadsheetObj.allowSave = !this.isReadOnly;
    // Add more restrictions as needed
  }
}
```

## 📊 Testing

Run unit tests:

```bash
npm test
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use a different port
ng serve --port 4300
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Spreadsheet Not Loading
- Check browser console for errors
- Verify internet connection (CDN file access)
- Clear browser cache and reload

## 📚 Resources

- [Syncfusion Angular Spreadsheet Docs](https://help.syncfusion.com/document-processing/excel/spreadsheet/angular/overview)
- [Sheet Protection](https://help.syncfusion.com/document-processing/excel/spreadsheet/angular/protect-sheet)
- [Read Only in Spreadsheet](https://help.syncfusion.com/document-processing/excel/spreadsheet/angular/protect-sheet#make-cells-read-only-without-protecting-worksheet)
- [Ribbon Customization](https://help.syncfusion.com/document-processing/excel/spreadsheet/angular/ribbon)
- [Syncfusion Angular Spreadsheet API reference](https://ej2.syncfusion.com/angular/documentation/api/spreadsheet/index-default)
- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 License

This repository contains sample code provided for demonstration purposes only. For information about Syncfusion licensing and license activation, refer to the [Syncfusion License Documentation](https://help.syncfusion.com/document-processing/licensing/overview).
