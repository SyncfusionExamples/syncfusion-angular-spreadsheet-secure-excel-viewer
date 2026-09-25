import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('IAk8BicRIAEqCzQhAR8kAxMHIgRJXmdXf010TGhbf1x2aVRGfV5UVHdZSF5rQ31afUdjW3leeXZQR2ZfWER1XktYakJ9Vw==');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
