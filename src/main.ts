import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, { 
  providers: [
    ...appConfig.providers,  // ✅ Include existing providers
    provideAnimationsAsync(), provideAnimationsAsync() // ✅ Add additional providers correctly
  ]
}).catch(err => console.error(err));
