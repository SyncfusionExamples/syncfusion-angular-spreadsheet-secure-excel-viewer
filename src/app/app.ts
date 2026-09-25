import { Component } from '@angular/core';
import { SpreadsheetComponent } from './spreadsheet';

/**
 * Root App Component
 *
 * The main application component that orchestrates the application layout
 * and renders the SpreadsheetComponent.
 *
 * Spreadsheet Management:
 * The Spreadsheet is now managed by the SpreadsheetComponent, which handles:
 * - Initialization and configuration
 * - Security (read-only mode by default)
 * - Mode toggling (read-only vs edit)
 * - Action restriction and event handling
 *
 * The App component no longer directly manages Spreadsheet instance or APIs.
 * Spreadsheet auto-loads on component initialization.
 */
@Component({
  selector: 'app-root',
  imports: [SpreadsheetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {}

