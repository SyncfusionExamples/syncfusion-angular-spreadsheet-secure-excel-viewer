import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpreadsheetAllModule, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpreadsheetAllModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  @ViewChild('spreadsheet')
  public spreadsheetObj!: SpreadsheetComponent;
}
