import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Vehicle} from '../../models/vehicle.model';
import {Brand} from '../../models/brand.model';
import {Model} from '../../models/model.model';
import {VehicleService} from '../../service/vehicle.service';
import {BrandService} from '../../service/brand.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Utils} from '../../utils/utils';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle = new Vehicle();
  displayDialog: boolean = false;
  editMode: boolean = false;
  vehicleForm!: FormGroup;
  brands: Brand[] = [];
  models: Model[] = [];
  modelsFilteredByBrand: Model[] = [];
  selectedBrandId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initVehicleForm();
    this.loadVehicles();
    this.loadBrands();
  }

  initVehicleForm(): void {
    this.vehicleForm = this.fb.group({
      brand: new FormControl('', Validators.required),
      model: new FormControl('', Validators.required),
      modelYear: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]{3}$/)]),
      vin: new FormControl('', Validators.nullValidator),
      price: new FormControl('', Validators.required),
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load vehicles.' + error.message,
        });
      }
    });
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load brands.' + error.message,
        });
      }
    });
  }


  fireOnChange() {

  }

  onBrandSelectionChange(event: any): void {
    const selectedBrand: Brand = event.value;
    this.selectedBrandId = selectedBrand ? selectedBrand.id : undefined;
    if (this.selectedBrandId) {
      // Filter the models based on the selected brand
      this.vehicleService.getFilteredModels(this.selectedBrandId).subscribe({
        next: (models) => {
          this.modelsFilteredByBrand = models;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load models for the selected brand.' + error.message,
          });
        },
      });
    } else {
      this.modelsFilteredByBrand = this.models;
    }
  }

  showAddDialog(): void {
    this.selectedVehicle = new Vehicle();
    this.editMode = false;
    this.displayDialog = true;
    this.vehicleForm.reset();
  }

  showEditDialog(vehicle: Vehicle): void {
    this.onBrandSelectionChange({ value: vehicle.brand });
    this.selectedVehicle = { ...vehicle };
    this.editMode = true;
    this.displayDialog = true;
    this.vehicleForm.patchValue(vehicle);
  }

  saveVehicle(): void {
    if (this.vehicleForm.invalid) {
      Utils.checkForUntouched(this.vehicleForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    this.selectedVehicle = { ...this.selectedVehicle, ...this.vehicleForm.value };

    if (this.editMode) {
      this.vehicleService.updateVehicle(this.selectedVehicle).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Vehicle updated successfully.'
          });
          this.displayDialog = false;
          this.loadVehicles();
        },
        error: (error: any) => {
          console.error('Error updating vehicle:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update vehicle.' + error.message,
          });
        }
      });
    } else {
      this.vehicleService.createVehicle(this.selectedVehicle).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Vehicle created successfully.',
          });
          this.displayDialog = false;
          this.loadVehicles();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create vehicle.' + error.message,
          });
        },
      });
    }
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this vehicle?',
      accept: () => {
        this.vehicleService.deleteVehicle(vehicle.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Vehicle deleted successfully.',
            });
            this.loadVehicles();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete vehicle.' + error.message,
            });
          }
        });
      },
    });
  }

  cancel(): void {
    this.displayDialog = false;
    this.vehicleForm.reset();
  }
}
