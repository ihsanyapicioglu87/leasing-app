// vehicle.component.ts

import { Component, OnInit } from '@angular/core';
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
  selectedVehicle: Vehicle = {id: 0, brand: '', model: '', modelYear: 0, vin: '', price: 0};
  displayDialog: boolean = false;
  editMode: boolean = false;

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
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
  }

  showEditDialog(vehicle: Vehicle): void {
    this.selectedVehicle = { ...vehicle };
    this.editMode = true;
    this.displayDialog = true;
  }

  saveVehicle(): void {
    if (this.editMode) {
      this.vehicleService.updateVehicle(this.selectedVehicle!).subscribe(
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
      this.vehicleService.createVehicle(this.selectedVehicle!).subscribe(
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
  }
}
