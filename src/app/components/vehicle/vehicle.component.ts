import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../service/vehicle.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

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

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initVehicleForm();
    this.loadVehicles();
  }

  initVehicleForm(): void {
    this.vehicleForm = this.fb.group({
      brand: new FormControl('', Validators.required),
      model: new FormControl('', Validators.required),
      modelYear: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]{3}$/)]),
      vin: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe(
      (vehicles) => {
        this.vehicles = vehicles;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load vehicles.',
        });
      }
    );
  }

  showAddDialog(): void {
    this.selectedVehicle = new Vehicle();
    this.editMode = false;
    this.displayDialog = true;
    this.vehicleForm.reset();
  }

  showEditDialog(vehicle: Vehicle): void {
    this.selectedVehicle = { ...vehicle };
    this.editMode = true;
    this.displayDialog = true;
    this.vehicleForm.patchValue(vehicle);
  }

  saveVehicle(): void {
    if (this.vehicleForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    this.selectedVehicle = { ...this.selectedVehicle, ...this.vehicleForm.value };

    if (this.editMode) {
      this.vehicleService.updateVehicle(this.selectedVehicle).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Vehicle updated successfully.',
          });
          this.displayDialog = false;
          this.loadVehicles();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update vehicle.',
          });
        }
      );
    } else {
      this.vehicleService.createVehicle(this.selectedVehicle).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Vehicle created successfully.',
          });
          this.displayDialog = false;
          this.loadVehicles();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create vehicle.',
          });
        }
      );
    }
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this vehicle?',
      accept: () => {
        this.vehicleService.deleteVehicle(vehicle.id!).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Vehicle deleted successfully.',
            });
            this.loadVehicles();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete vehicle.',
            });
          }
        );
      },
    });
  }

  cancel(): void {
    this.displayDialog = false;
    this.vehicleForm.reset();
  }
}
