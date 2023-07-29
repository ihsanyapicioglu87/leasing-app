import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  items!: any[];
  loggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getLoggedInStatus().subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });

    this.items = [
      {
        label: 'Vehicles',
        icon: 'pi pi-car',
        routerLink: '/vehicles'
      },
      {
        label: 'Brands',
        icon: 'pi pi-tag',
        routerLink: '/brands'
      },
      {
        label: 'Models',
        icon: 'pi pi-cog',
        routerLink: '/models'
      },
      {
        label: 'Customers',
        icon: 'pi pi-users',
        routerLink: '/customers'
      },
      {
        label: 'Users',
        icon: 'pi pi-user',
        routerLink: '/users'
      },
      {
        label: 'Roles',
        icon: 'pi pi-user',
        routerLink: '/roles'
      },
      {
        label: 'Leasing Contracts',
        icon: 'pi pi-file',
        routerLink: '/leasing-contracts'
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout()
      }
    ];
  }
}
