import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginComponent } from 'src/app/login/login.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(public loginComponent: LoginComponent, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }
}
