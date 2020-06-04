import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NuovaPraticaComponent } from './nuova-pratica/nuova-pratica.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './user/user.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth-interceptor.service';
import { CanDeactivateGuard } from './core/guards/can-deactivate.guard';
import { MiePraticheComponent } from './mie-pratiche/mie-pratiche.component';
import { ComponentsModule } from './core/components/components.module';
import { MaterialModule } from './core/module/material/material.module';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RicercaPraticheComponent } from './ricerca-pratiche/ricerca-pratiche.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './core/models/custom-paginator';
import { DocumentsUploadedPipe } from './core/pipes/documents-uploaded.pipe';
import { CategoryPipe } from './core/pipes/category.pipe';
import { StatusPipe } from './core/pipes/status.pipe';
import { RotturaSuoloComponent } from './pratiche/moduli/components-edilizia/rottura-suolo/rottura-suolo.component';
import { EdiliziaComponent } from './pratiche/moduli/edilizia/edilizia.component';
import { PraticheModule } from './pratiche/pratiche.module';

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'LL'],
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    EdiliziaComponent,
    RotturaSuoloComponent,
    HomeComponent,
    NuovaPraticaComponent,
    LoginComponent,
    SignupComponent,
    UserComponent,
    MiePraticheComponent,
    RicercaPraticheComponent,
    DocumentsUploadedPipe,
    CategoryPipe,
    StatusPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ComponentsModule,
    FontAwesomeModule,
    HttpClientModule,
    PraticheModule
  ],
  providers: [
    CanDeactivateGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MatPaginatorIntl, useClass: CustomPaginator},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
