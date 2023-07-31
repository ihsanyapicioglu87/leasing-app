import {Component, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {Utils} from "../utils/utils";
import {UserRole} from "../enums/roles.enum";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  items!: any[];
  loggedIn: boolean = false;
  loggedInUser: any | null = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getLoggedInStatus().subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });

    this.authService.loggedInUser$.subscribe((loggedInUser) => {
      if (loggedInUser) {
        this.initMenuItems();
      }
    });
  }

  initMenuItems() {
    this.items = [
      {
        label: 'Vehicles',
        icon: 'pi pi-car',
        routerLink: '/vehicles',
        visible: Utils.hasRole(UserRole.ROLE_USER) || Utils.hasRole(UserRole.ROLE_ADMIN),
      },
      {
        label: 'Brands',
        icon: 'pi pi-tag',
        routerLink: '/brands',
        visible: Utils.hasRole(UserRole.ROLE_USER) || Utils.hasRole(UserRole.ROLE_ADMIN),
      },
      {
        label: 'Models',
        icon: 'pi pi-cog',
        routerLink: '/models',
        visible: Utils.hasRole(UserRole.ROLE_USER) || Utils.hasRole(UserRole.ROLE_ADMIN),
      },
      {
        label: 'Customers',
        icon: 'pi pi-users',
        routerLink: '/customers',
        visible: Utils.hasRole(UserRole.ROLE_USER) || Utils.hasRole(UserRole.ROLE_ADMIN),
      },
      {
        label: 'Users',
        icon: 'pi pi-user',
        routerLink: '/users',
        visible: Utils.hasRole(UserRole.ROLE_ADMIN),
      },
      {
        label: 'Roles',
        icon: 'pi pi-share-alt',
        routerLink: '/roles',
        visible: Utils.hasRole(UserRole.ROLE_ADMIN),
      },
      {
        label: 'Leasing Contracts',
        icon: 'pi pi-file',
        routerLink: '/leasing-contracts',
        visible: Utils.hasRole(UserRole.ROLE_USER) || Utils.hasRole(UserRole.ROLE_ADMIN)
      }
    ];
  }

  logout(): void {
    this.authService.logout();
  }

  getUsername(): string | null {
    return Utils.getLoggedInUserName();
  }
}
