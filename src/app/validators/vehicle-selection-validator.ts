import {AbstractControl} from '@angular/forms';

export function vehicleSelectionValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedVehicle = control.value;
    if (selectedVehicle === null) {
        return { 'vehicleSelection': true };
    }

    return null;
}
