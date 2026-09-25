import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Your license key');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
