import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './components/customer/customer.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { LeasingContractComponent } from './components/leasing-contract/leasing-contract.component';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './components/user/user.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MenubarModule } from 'primeng/menubar';
import { RoleComponent } from './components/role/role.component';
import { MultiSelectModule } from "primeng/multiselect";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BrandComponent } from './components/brand/brand.component';
import { ModelComponent } from './components/model/model.component';
import {InputTextModule} from "primeng/inputtext";

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    VehicleComponent,
    LeasingContractComponent,
    DashboardComponent,
    LayoutComponent,
    LoginComponent,
    UserComponent,
    MenuBarComponent,
    RoleComponent,
    BrandComponent,
    ModelComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        TableModule,
        TableModule,
        ButtonModule,
        DialogModule,
        CalendarModule,
        FormsModule,
        DropdownModule,
        ConfirmDialogModule,
        HttpClientModule,
        NoopAnimationsModule,
        ToastModule,
        ReactiveFormsModule,
        MenubarModule,
        MultiSelectModule,
        AutoCompleteModule,
        InputTextModule

    ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
