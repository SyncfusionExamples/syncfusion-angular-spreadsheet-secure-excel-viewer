# Syncfusion Angular Spreadsheet - Secure Excel Viewer

A production-ready Angular application demonstrating a **secure, read-only Excel viewer** with **toggle-based edit mode** using [Syncfusion Angular Spreadsheet](https://www.syncfusion.com/angular-components/angular-spreadsheet) component. Perfect for implementing compliant data viewing solutions with granular security controls.

## 🎯 Features

- **Secure View Mode (Read-Only)** - Default mode with all restrictions enabled
  - Cell editing disabled
  - Copy/paste operations blocked
  - Save functionality disabled
  - Sheet structure protected

- **Flexible Edit Mode** - Toggle to allow authorized editing
  - Full cell editing capabilities
  - Clipboard operations enabled
  - Save functionality available
  - Structural modifications remain restricted for safety

- **Mode Toggle Switch** - Syncfusion Switch component for seamless mode switching
  - Real-time visual indicators (View Mode / Edit Mode)
  - Automatic UI updates based on mode
  - Accessibility-compliant toggle control

- **Security Controls**
  - Column-level read-only protection
  - Workbook protection (prevents sheet operations)
  - Contextual menu restrictions
  - Toolbar item state management

- **Responsive Design**
  - Mobile-friendly layout
  - Tailwind CSS 3 styling
  - Adaptive viewport rendering

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

## 💡 Usage

### Basic Implementation

The component auto-loads with a sample Excel file and initializes in **View Mode** by default:

```html
<app-spreadsheet></app-spreadsheet>
```

### Component Integration

```typescript
import { SpreadsheetComponent } from './spreadsheet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SpreadsheetComponent],
  template: '<app-spreadsheet></app-spreadsheet>'
})
export class AppComponent {}
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

**Test Coverage:**
- Component initialization
- Mode toggle functionality
- Read-only restrictions
- Edit mode capabilities
- Template rendering
- Accessibility features

## 🎨 Theming

The application uses **Tailwind CSS 3** with Syncfusion theming. To customize:

1. **Global Styles**: Edit `src/styles.css`
2. **Component Styles**: Edit `src/app/spreadsheet/spreadsheet.component.css`
3. **Tailwind Config**: Modify `tailwind.config.js` (if present)

### Color Scheme

- **View Mode**: Amber (#d97706) for read-only indication
- **Edit Mode**: Blue (#2563eb) for editing indication
- **Neutral**: Gray (#6b7280) for descriptions

## ♿ Accessibility

- **ARIA Labels**: Proper accessibility labels on toggle switch
- **Semantic HTML**: Meaningful element structure
- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Reader**: Descriptive status messages for assistive technologies

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

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
- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 License

This repository contains sample code and is provided as-is for demonstration purposes. Check the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 💬 Support

For issues, questions, or feedback:
- Open an issue in the [GitHub repository](https://github.com/SyncfusionExamples/syncfusion-angular-spreadsheet-secure-excel-viewer/issues)
- Check existing documentation and examples
- Review the Syncfusion support portal

## 🎓 Learning Resources

- View Mode vs Edit Mode demonstration
- Security model implementation patterns
- Responsive Angular component design
- Syncfusion component integration best practices

---

**Built with ❤️ using Syncfusion and Angular**

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
