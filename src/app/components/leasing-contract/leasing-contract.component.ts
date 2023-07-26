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
  displayDialog: boolean = false;
  editMode: boolean = false;

  // Declare a FormGroup for the leasing contract form
  leasingContractForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private leasingContractService: LeasingContractService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    // Initialize the leasing contract form with the required form controls
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
    this.loadVehicles();
  }

  loadLeasingContracts(): void {
    this.leasingContractService.getLeasingContracts().subscribe((leasingContracts) => {
      // Fetch customers and vehicles separately
      this.customerService.getCustomers().subscribe((customers) => {
        this.vehicleService.getVehicles().subscribe((vehicles) => {
          // Create an array to store the final data for each leasing contract
          const leasingContractData: any[] = [];
  
          for (const leasingContract of leasingContracts) {
            // Find the corresponding customer and vehicle for each leasing contract
            const customer = customers.find((c) => c.id === leasingContract.customerId);
            const vehicle = vehicles.find((v) => v.id === leasingContract.vehicleId);
  
            // Combine the relevant data for the leasing contract
            const leasingContractInfo = {
              id: leasingContract.id,
              contractNumber: leasingContract.contractNumber,
              monthlyRate: leasingContract.monthlyRate,
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
      // Add the "Select One" option as the default option
      this.customers = [
        { label: 'Select One', value: null },
        ...customers.map((customer) => ({
          label: customer.firstName + ' ' + customer.lastName,
          value: customer,
        })),
      ];
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe((vehicles) => {
      // Add the "Select One" option as the default option
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
    // Reset the form when showing the dialog for adding a new leasing contract
    this.leasingContractForm.reset();
  }

showEditDialog(leasingContract: LeasingContract): void {
  this.selectedLeasingContract = { ...leasingContract };
  this.displayDialog = true;
  this.editMode = true;

  // Fetch the Customer and Vehicle objects based on their IDs
  this.customerService.getCustomerById(leasingContract.customerId).subscribe((customer) => {
    this.leasingContractForm.controls['customer'].setValue(customer);
  });

  this.vehicleService.getVehicleById(leasingContract.vehicleId).subscribe((vehicle) => {
    this.leasingContractForm.controls['vehicle'].setValue(vehicle);
  });

  // Set the form values when showing the dialog for editing an existing leasing contract
  this.leasingContractForm.patchValue({
    contractNumber: leasingContract.contractNumber,
    monthlyRate: leasingContract.monthlyRate,
  });
}

  saveLeasingContract(): void {
    // Check if the form is valid
    if (this.leasingContractForm.valid) {
      // Assign form values to the selectedLeasingContract object
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
        this.leasingContractService.createLeasingContract(this.selectedLeasingContract!).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leasing Contract created successfully' });
          this.displayDialog = false;
          this.loadLeasingContracts();
        });
      }
    } else {
      // Show an error message if the form is invalid
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

  cancel(): void {
    this.displayDialog = false;
    this.selectedLeasingContract = undefined;
  }
}
