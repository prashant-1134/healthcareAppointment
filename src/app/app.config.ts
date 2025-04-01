import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { UrlConstants } from './core/constants/url_constants';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes), { provide: UrlConstants, useValue: new UrlConstants() },
    provideAnimationsAsync(), 
    provideNativeDateAdapter(),
    provideToastr()
    
  ]
  

};
