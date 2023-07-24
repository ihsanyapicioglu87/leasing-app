import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasingContractComponent } from './leasing-contract.component';

describe('LeasingContractComponent', () => {
  let component: LeasingContractComponent;
  let fixture: ComponentFixture<LeasingContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeasingContractComponent]
    });
    fixture = TestBed.createComponent(LeasingContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
