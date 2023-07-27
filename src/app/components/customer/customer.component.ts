import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../service/customer.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  customer: Customer = { firstName: '', lastName: '', birthdate: new Date() };
  displayDialog!: boolean;
  isNewCustomer!: boolean;
  customerForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: [new Date(), Validators.required]
    });

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data) => {
        this.customers = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  showDialogToAdd() {
    this.isNewCustomer = true;
    this.displayDialog = true;
  }

  editCustomer(customer: Customer) {
    this.isNewCustomer = false;
    this.customer = { ...customer };
    this.displayDialog = true;
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this customer?',
      accept: () => {
        this.customerService.deleteCustomer(customer.id!).subscribe(
          () => {
            this.loadCustomers();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer deleted successfully.' });
          },
          (error) => {
            console.error('Error deleting customer:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer.' });
          }
        );
      },
    });
  }

  saveCustomer() {
    if (this.isNewCustomer) {
      if (this.customerForm.valid) {
        this.customerService.addCustomer(this.customer).subscribe(
          () => {
            this.loadCustomers();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer added successfully.' });
            this.cancel();
          },
          (error) => {
            console.error('Error adding customer:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add customer.' });
          }
        );
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.' });
      }
    } else {
      if (this.customerForm.valid) {
        this.customerService.updateCustomer(this.customer).subscribe(
          () => {
            this.loadCustomers();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer updated successfully.' });
            this.cancel();
          },
          (error) => {
            console.error('Error updating customer:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update customer.' });
          }
        );
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.' });
      }
    }
  }

  cancel() {
    this.displayDialog = false;
    this.customer = { firstName: '', lastName: '', birthdate: new Date() };
    this.customerForm.reset();
  }
}
