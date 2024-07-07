import * as z from "zod";
import {isValidPhoneNumber} from 'libphonenumber-js';
import {EmployeeType} from "@/model/employee-data";

export const employeeSchema = z.object({
    email: z.string().email('Invalid email address.'),
    familyName: z.string().min(2, 'Name must be at least 2 characters.'),
    givenName: z.string().min(2, 'Name must be at least 2 characters.'),
    phoneNumber: z.string()
        .refine(
            (value) => isValidPhoneNumber(value),
            {
                message: 'Invalid phone number. Please provide a valid phone number.',
            }
        ),
    type: z.nativeEnum(EmployeeType)
});
