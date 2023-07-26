import { Customer } from './customer.model';
import { Vehicle } from './vehicle.model';

export class LeasingContract {
  id?: number | null;
  contractNumber!: string;
  monthlyRate!: number;
  customerId!: number;
  vehicleId!: number;
}
