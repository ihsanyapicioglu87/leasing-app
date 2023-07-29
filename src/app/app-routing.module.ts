import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './components/customer/customer.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { LeasingContractComponent } from './components/leasing-contract/leasing-contract.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './components/user/user.component';
import { RoleComponent } from './components/role/role.component';
import {BrandComponent} from "./components/brand/brand.component";
import {ModelComponent} from "./components/model/model.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'login', component: LoginComponent },
      { path: 'customers', component: CustomerComponent },
      { path: 'vehicles', component: VehicleComponent },
      { path: 'users', component: UserComponent },
      { path: 'roles', component: RoleComponent },
      { path: 'brands', component: BrandComponent },
      { path: 'models', component: ModelComponent },
      { path: 'leasing-contracts', component: LeasingContractComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
