import { Router } from "express";
import { EmployeeController } from "../../controller/admin/employeeController";
import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import { uploadEmployeeFiles } from "../../middlewares/cloudinaryMulter";
import { EmployeeService } from "../../service/employeeService";
import { EmployeeRepository } from "../../repository/employeeRepository";

const employeeRouter = Router();
const employeeRepository = new EmployeeRepository();
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

// Create employee with profile picture
employeeRouter.post(
  "/",
  authenticationMiddleware,
  ...uploadEmployeeFiles,
  employeeController.createEmployee.bind(employeeController)
);

// Get all employees with search and pagination
employeeRouter.get(
  "/",
  authenticationMiddleware,
  employeeController.getEmployees.bind(employeeController)
);

// Get employee by ID
employeeRouter.get(
  "/:id",
  authenticationMiddleware,
  employeeController.getEmployeeById.bind(employeeController)
);

// Update employee with optional profile picture
employeeRouter.put(
  "/:id",
  authenticationMiddleware,
  ...uploadEmployeeFiles,
  employeeController.updateEmployee.bind(employeeController)
);

// Delete employee
employeeRouter.delete(
  "/:id",
  authenticationMiddleware,
  employeeController.deleteEmployee.bind(employeeController)
);

export { employeeRouter };