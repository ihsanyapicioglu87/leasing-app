// leasing-contract.model.ts

import { Customer } from './customer.model';
import { Vehicle } from './vehicle.model';

export class LeasingContract {
  id?: number;
  contractNumber!: string;
  monthlyRate!: number;
  customer!: Customer;
  vehicle!: Vehicle;
}
