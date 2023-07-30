import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Customer} from 'src/app/models/customer.model';
import {LeasingContract} from 'src/app/models/leasing-contract.model';
import {Vehicle} from 'src/app/models/vehicle.model';
import {CustomerService} from 'src/app/service/customer.service';
import {LeasingContractService} from 'src/app/service/leasing-contract.service';
import {VehicleService} from 'src/app/service/vehicle.service';
import {Utils} from "../../utils/utils";
import {of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {vehicleSelectionValidator} from "../../validators/vehicle-selection-validator";
import {CurrencyPipe} from "@angular/common";

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
  availableVehicles: Vehicle[] = [];


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
    private confirmationService: ConfirmationService,
    private currencyPipe: CurrencyPipe

  ) {
    this.leasingContractForm = this.formBuilder.group({
      contractNo: ['', Validators.required],
      monthlyRate: [0, Validators.required],
      customer: [null, Validators.required],
      vehicle: [null, vehicleSelectionValidator],
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
              contractNo: leasingContract.contractNo,
              monthlyRate: leasingContract.monthlyRate,
              customerId: leasingContract.customerId,
              vehicleId: leasingContract.vehicleId,
              customerInfo: customer ? `${customer.firstName} ${customer.lastName}` : 'N/A',
              vehicleInfo: vehicle ? `${vehicle.brand.name} ${vehicle.model.name}` : 'N/A',
              vin: vehicle ? `${vehicle.vin}` : 'N/A',
              price: vehicle ? `${vehicle.price}` : 'N/A',
            };

            leasingContractData.push(leasingContractInfo);
          }

          this.leasingContracts = leasingContractData;
        });
      });
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().pipe(
        catchError((error) => {
          console.error('Error loading customers:', error);
          return of([]);
        })
    ).subscribe((customers) => {
      this.customers = [
        ...customers.map((customer) => ({
          label: customer.firstName + ' ' + customer.lastName,
          value: customer,
        })),
      ];
    });
  }

  loadVehiclesForDropdown(): void {
    this.vehicles = this.availableVehicles.map((vehicle) => ({
      label: vehicle.brand.name + ' ' + vehicle.model.name,
      value: vehicle,
    }));
    setTimeout(() => {
      this.leasingContractForm.controls['vehicle'].setValue({ label: this.selectedVehicle?.brand.name + ' ' + this.selectedVehicle?.model.name, value: this.selectedVehicle });
    });
  }

  loadAvailableVehicles(): void {
    this.leasingContractService.getAvailableVehicles().pipe(
        catchError((error) => {
          console.error('Error loading available vehicles:', error);
          return of([]); // Return an empty array in case of an error
        })
    ).subscribe((availableVehicles) => {
      this.availableVehicles = availableVehicles;

      this.vehicles = [
        ...this.availableVehicles.map((vehicle) => ({
          label: vehicle.brand.name + ' ' + vehicle.model.name,
          value: vehicle,
        })),
      ];

      if (this.selectedVehicle && !this.isVehicleAvailable(this.selectedVehicle)) {
        this.selectedVehicle = null;
      }

      this.leasingContractForm.get('vehicle')?.setValidators([vehicleSelectionValidator]);
      this.leasingContractForm.get('vehicle')?.updateValueAndValidity();

    });
  }

  isVehicleAvailable(vehicle: Vehicle): boolean {
    return this.availableVehicles.some((availableVehicle) => availableVehicle.id === vehicle.id);
  }

  showAddDialog(): void {
    this.selectedLeasingContract = new LeasingContract();
    this.displayDialog = true;
    this.editMode = false;
    this.leasingContractForm.reset();
    this.loadAvailableVehicles();
    if(this.availableVehicles.length < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'All vehicles are currently booked. There is no available vehicle for leasing.',
      });
    }
  }

  showEditDialog(leasingContract: LeasingContract): void {
    this.selectedLeasingContract = { ...leasingContract };
    this.editMode = true;

    this.customerService.getCustomerById(leasingContract.customerId).subscribe((customer) => {
      this.leasingContractForm.patchValue({
        customer: { label: customer.firstName + ' ' + customer.lastName, value: customer },
      });
    });

    this.loadAvailableVehicles();
    this.vehicleService.getVehicleById(leasingContract.vehicleId).subscribe((vehicle) => {
      this.selectedVehicle = vehicle;

      if (!this.isVehicleAvailable(vehicle)) {
        this.availableVehicles.push(vehicle);
      }
      this.loadVehiclesForDropdown();

      this.leasingContractForm.patchValue({
        vehicle: { label: this.selectedVehicle.brand.name + ' ' + this.selectedVehicle.model.name, value: this.selectedVehicle },
        contractNo: leasingContract.contractNo,
        monthlyRate: leasingContract.monthlyRate,
      });
    });
    this.displayDialog = true;
  }

  formatCurrency(monthlyRate: number | null): string {
    const formattedRate = this.currencyPipe.transform(monthlyRate, 'EUR', 'symbol', '1.2-2');
    return formattedRate !== null ? formattedRate : '';
  }

  saveLeasingContract(): void {
    if (this.leasingContractForm.invalid) {
      Utils.checkForUntouched(this.leasingContractForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }
    this.selectedLeasingContract!.contractNo = this.leasingContractForm.value.contractNo;
    this.selectedLeasingContract!.monthlyRate = this.leasingContractForm.value.monthlyRate;
    this.selectedLeasingContract!.customerId = this.leasingContractForm.value.customer.value.id;
    this.selectedLeasingContract!.vehicleId = this.leasingContractForm.value.vehicle.value.id;

    if (this.editMode) {
      this.leasingContractService.updateLeasingContract(this.selectedLeasingContract!).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leasing Contract updated successfully'
        });
        this.displayDialog = false;
        this.loadLeasingContracts();
      });
    } else {
      this.leasingContractService.createLeasingContract(this.selectedLeasingContract!).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Leasing Contract created successfully',
          });
          this.displayDialog = false;
          this.loadLeasingContracts();
          this.loadAvailableVehicles();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create Leasing Contract.' + error.message,
          });
          this.loadAvailableVehicles();
        },
      });
    }
  }

  deleteLeasingContract(leasingContract: LeasingContract): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this leasing contract?',
      accept: () => {
        this.leasingContractService.deleteLeasingContract(leasingContract.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Leasing Contract deleted successfully'
            });
            this.loadLeasingContracts();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete leasing contract.' + error.message,
            });
          }
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
    this.leasingContractForm.reset();
  }

  onEditDialogHide() {
    this.cancel();
  }
}
