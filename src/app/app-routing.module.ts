import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './components/customer/customer.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { LeasingContractComponent } from './components/leasing-contract/leasing-contract.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './components/user/user.component';
import { RoleComponent } from './role/role.component';

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
      { path: 'leasing-contracts', component: LeasingContractComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
