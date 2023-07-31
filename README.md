# Allane Leasing Application - Frontend (Angular)

This is the README file for the Allane SE Leasing Application frontend built with Angular. The frontend application complements the backend Spring Boot project and provides the user interface for managing leasing contracts, customers, vehicles, and other functionalities. The Angular project is named "leasing-app."

## Preconditions

Before running the frontend application, please ensure the following prerequisites are met:

1. Node.js and npm are installed on your system.
2. Angular CLI is installed on your system.

## How to Start the Frontend Application

Follow the steps below to set up and run the Allane SE Leasing Application frontend:

1. **Clone the Git repository:**
   ```bash
   git clone https://github.com/ihsanyapicioglu87/leasing-app.git
   cd leasing-app
2. **Install dependencies:**
   npm install
3. **Start the Application**
   ng serve

4.The application will be accessible at: **http://localhost:4200**

## Application Structure

The Angular frontend follows a modular structure, with separate modules for different parts of the application. The main modules include:

- **Customers:** Manage customer information and leasing contracts associated with each customer.
- **Vehicles:** Manage vehicle information, brands, and models.
- **Leasing Contracts:** Create and manage leasing contracts, including contract details, monthly rates, and associated vehicles and customers.
- **Users and Roles:** Provide login and logout mechanism and manage user roles and permissions.

## Chosen Solution

Angular was chosen as the frontend framework for the Allane SE Leasing Application due to its flexibility, scalability, and rich ecosystem of libraries and tools. It allows us to build a responsive and user-friendly user interface, making it an ideal choice for enterprise-grade applications.

The frontend is designed to communicate with the backend Spring Boot application through REST APIs, ensuring a seamless integration between the frontend and backend components.

