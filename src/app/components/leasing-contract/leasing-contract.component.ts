// leasing-contract.component.ts

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer } from 'src/app/models/customer.model';
import { LeasingContract } from 'src/app/models/leasing-contract.model';
import { Vehicle } from 'src/app/models/vehicle.model';
import { CustomerService } from 'src/app/service/customer.service';
import { LeasingContractService } from 'src/app/service/leasing-contract.service';
import { VehicleService } from 'src/app/service/vehicle.service';

@Component({
  selector: 'app-leasing-contract',
  templateUrl: './leasing-contract.component.html',
  styleUrls: ['./leasing-contract.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class LeasingContractComponent implements OnInit {
  leasingContracts: LeasingContract[] = [];
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];

  selectedLeasingContract: LeasingContract | undefined;
  displayDialog: boolean = false;
  editMode: boolean = false;

  constructor(
    private leasingContractService: LeasingContractService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadLeasingContracts();
    this.loadCustomers();
    this.loadVehicles();
  }

  loadLeasingContracts(): void {
    this.leasingContractService.getLeasingContracts().subscribe((leasingContracts) => {
      this.leasingContracts = leasingContracts;
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
  }

  showAddDialog(): void {
    this.selectedLeasingContract = new LeasingContract();
    this.displayDialog = true;
    this.editMode = false;
  }

  showEditDialog(leasingContract: LeasingContract): void {
    this.selectedLeasingContract = { ...leasingContract };
    this.displayDialog = true;
    this.editMode = true;
  }

  saveLeasingContract(): void {
    if (this.editMode) {
      this.leasingContractService.updateLeasingContract(this.selectedLeasingContract!).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leasing Contract updated successfully' });
        this.displayDialog = false;
        this.loadLeasingContracts();
      });
    } else {
      this.leasingContractService.createLeasingContract(this.selectedLeasingContract!).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leasing Contract created successfully' });
        this.displayDialog = false;
        this.loadLeasingContracts();
      });
    }
  }

  deleteLeasingContract(leasingContract: LeasingContract): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this leasing contract?',
      accept: () => {
        this.leasingContractService.deleteLeasingContract(leasingContract.id!).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leasing Contract deleted successfully' });
          this.loadLeasingContracts();
        });
      },
    });
  }

  cancel(): void {
    this.displayDialog = false;
    this.selectedLeasingContract = undefined;
  }
}
