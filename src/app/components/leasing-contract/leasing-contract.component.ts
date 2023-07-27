import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  customers: { label: string; value: Customer | null }[] = [];
  vehicles: { label: string; value: Vehicle | null }[] = [];

  selectedLeasingContract: LeasingContract | undefined;
  selectedCustomer: Customer | null = null;
  selectedVehicle: Vehicle | null = null;

  displayDialog: boolean = false;
  editMode: boolean = false;
  displayDetailsDialog: boolean = false;

  leasingContractForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private leasingContractService: LeasingContractService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.leasingContractForm = this.formBuilder.group({
      contractNumber: ['', Validators.required],
      monthlyRate: [0, Validators.required],
      customer: [null, Validators.required],
      vehicle: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLeasingContracts();
    this.loadCustomers();
    this.loadAvailableVehicles();
  }

  loadLeasingContracts(): void {
    this.leasingContractService.getLeasingContracts().subscribe((leasingContracts) => {
      this.customerService.getCustomers().subscribe((customers) => {
        this.vehicleService.getVehicles().subscribe((vehicles) => {
          const leasingContractData: any[] = [];

          for (const leasingContract of leasingContracts) {
            const customer = customers.find((c) => c.id === leasingContract.customerId);
            const vehicle = vehicles.find((v) => v.id === leasingContract.vehicleId);

            const leasingContractInfo = {
              id: leasingContract.id,
              contractNumber: leasingContract.contractNumber,
              monthlyRate: leasingContract.monthlyRate,
              customerId: leasingContract.customerId,
              vehicleId: leasingContract.vehicleId,
              customerInfo: customer ? `${customer.firstName} ${customer.lastName}` : 'N/A',
              vehicleInfo: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A',
            };

            leasingContractData.push(leasingContractInfo);
          }

          this.leasingContracts = leasingContractData;
        });
      });
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = [
        { label: 'Select One', value: null },
        ...customers.map((customer) => ({
          label: customer.firstName + ' ' + customer.lastName,
          value: customer,
        })),
      ];
    });
  }

  loadAvailableVehicles(): void {
    this.leasingContractService.getAvailableVehicles().subscribe((vehicles) => {
      this.vehicles = [
        { label: 'Select One', value: null },
        ...vehicles.map((vehicle) => ({
          label: vehicle.brand + ' ' + vehicle.model,
          value: vehicle,
        })),
      ];
    });
  }

  showAddDialog(): void {
    this.selectedLeasingContract = new LeasingContract();
    this.displayDialog = true;
    this.editMode = false;
    this.loadAvailableVehicles();
    this.leasingContractForm.reset();
  }

  showEditDialog(leasingContract: LeasingContract): void {
    this.selectedLeasingContract = { ...leasingContract };
    this.displayDialog = true;
    this.editMode = true;

    this.customerService.getCustomerById(leasingContract.customerId).subscribe((customer) => {
      this.leasingContractForm.controls['customer'].setValue(customer);
    });

    this.vehicleService.getVehicleById(leasingContract.vehicleId).subscribe((vehicle) => {
      this.leasingContractForm.controls['vehicle'].setValue(vehicle);
    });

    this.leasingContractForm.patchValue({
      contractNumber: leasingContract.contractNumber,
      monthlyRate: leasingContract.monthlyRate,
    });
  }

  saveLeasingContract(): void {
    if (this.leasingContractForm.valid) {
      this.selectedLeasingContract!.contractNumber = this.leasingContractForm.value.contractNumber;
      this.selectedLeasingContract!.monthlyRate = this.leasingContractForm.value.monthlyRate;
      this.selectedLeasingContract!.customerId = this.leasingContractForm.value.customer.value.id;
      this.selectedLeasingContract!.vehicleId = this.leasingContractForm.value.vehicle.value.id;

      if (this.editMode) {
        this.leasingContractService.updateLeasingContract(this.selectedLeasingContract!).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leasing Contract updated successfully' });
          this.displayDialog = false;
          this.loadLeasingContracts();
        });
      } else {
        this.leasingContractService.createLeasingContract(this.selectedLeasingContract!).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Leasing Contract created successfully',
            });
            this.displayDialog = false;
            this.loadLeasingContracts();
            this.loadAvailableVehicles();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create Leasing Contract.',
            });
            this.loadAvailableVehicles();
          }
        );
      }

    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
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

  fetchCustomerAndVehicleDetails() {
    if (this.selectedLeasingContract) {
      this.customerService
        .getCustomerById(this.selectedLeasingContract.customerId)
        .subscribe((customer) => {
          this.selectedCustomer = customer;
        });

      this.vehicleService
        .getVehicleById(this.selectedLeasingContract.vehicleId)
        .subscribe((vehicle) => {
          this.selectedVehicle = vehicle;
        });
    }
  }

  showDetails(contract: LeasingContract) {
    this.selectedLeasingContract = contract;
    this.fetchCustomerAndVehicleDetails();
    this.displayDetailsDialog = true;
  }

  hideDetailsDialog() {
    this.displayDetailsDialog = false;
  }

  cancel(): void {
    this.displayDialog = false;
    this.selectedLeasingContract = undefined;
    this.loadAvailableVehicles();
  }
}
