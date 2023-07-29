import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../service/customer.service';
import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  customer: Customer = {firstName: '', lastName: '', birthdate: new Date()};
  displayDialog!: boolean;
  isNewCustomer!: boolean;
  customerForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: [new Date(), Validators.required]
    });

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load customers.' + error.message,
        });
      }
    });
  }

  showDialogToAdd() {
    this.isNewCustomer = true;
    this.displayDialog = true;
  }

  editCustomer(customer: Customer) {
    this.isNewCustomer = false;
    this.customer = {...customer};
    this.displayDialog = true;
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this customer?',
      accept: () => {
        this.customerService.deleteCustomer(customer.id!).subscribe({
          next: () => {
            this.loadCustomers();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Customer deleted successfully.'
            });
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete customer.' + error.message
            });
          }
        });

      },
    });
  }

  saveCustomer() {
    if (this.isNewCustomer) {
      if (this.customerForm.invalid) {
        Utils.checkForUntouched(this.customerForm);
        Utils.addInvalidFormMessage(this.messageService);
        return;
      }
      this.customerService.addCustomer(this.customer).subscribe({
        next: () => {
          this.loadCustomers();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer added successfully.',
          });
          this.cancel();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add customer.' + error.message,
          });
        },
      });
    } else {
      this.customerService.updateCustomer(this.customer).subscribe({
        next: () => {
          this.loadCustomers();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer updated successfully.'
          });
          this.cancel();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update customer.' + error.message,
          });
        }
      });
    }
  }

  cancel() {
    this.displayDialog = false;
    this.customer = {firstName: '', lastName: '', birthdate: new Date()};
    this.customerForm.reset();
  }
}
