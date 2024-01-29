import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownListModule, DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { GlobalModule, PendingChangesGuard } from "global";
import { MainInterceptor } from "../app/main-interceptor";
import { AppRoutingModule, userComponentDeclaration } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TenantAssignApplicationsComponent } from './tenant/pages/tenant-assign-applications/tenant-assign-applications.component';
import { ExportFilesToComponent } from './Shared/components/export-files-to/export-files-to.component';
import { MatTablePaginatorComponent } from './Shared/components/mat-table-paginator/mat-table-paginator.component';

@NgModule({
  declarations: [
    AppComponent,
    ExportFilesToComponent,
    MatTablePaginatorComponent,
    userComponentDeclaration,
    TenantAssignApplicationsComponent
  ],
  imports: [
    //Impoted all library/npm packages
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTreeModule,
    MatSortModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSortModule,
    MatRadioModule,
    MatPaginatorModule,
    AngularDualListBoxModule,
    DropDownListModule,
    DropDownTreeModule,
    GlobalModule,
    AppRoutingModule,
    AngularMultiSelectModule,
    MatAutocompleteModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    PendingChangesGuard,
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check-indeterminate', color: 'primary' } as MatCheckboxDefaultOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
