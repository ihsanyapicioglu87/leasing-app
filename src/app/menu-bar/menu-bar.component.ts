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
      this.updateMenuItems();
    });

    this.items = [
      {
        label: 'Vehicles',
        icon: 'pi pi-car',
        routerLink: '/vehicles',
        disabled: true
      },
      {
        label: 'Customers',
        icon: 'pi pi-users',
        routerLink: '/customers',
        disabled: true
      },
      {
        label: 'Users',
        icon: 'pi pi-user',
        routerLink: '/users',
        disabled: true
      },
      {
        label: 'Leasing Contracts',
        icon: 'pi pi-file',
        routerLink: '/leasing-contracts',
        disabled: true
      }
    ];

    this.updateMenuItems();
  }

  updateMenuItems() {
    if (this.loggedIn) {
      this.items.forEach((item) => {
        item.disabled = false;
      });
    }
  }
}
