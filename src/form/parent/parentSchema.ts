import * as z from "zod";
import {isValidPhoneNumber} from 'libphonenumber-js';

export const phoneNumbersSchema = z.array(
    z.string().refine(
        (value) => isValidPhoneNumber(value),
        {
            message: 'Invalid phone number. Please provide a valid phone number.',
        }
    )
)
const uniqueName = (items: string[]) =>
    z.string().refine(data => !items.includes(data), {
        message: "Phone number already added"
    });
export const getPhoneNumbersSchema = (numbers: z.infer<typeof phoneNumbersSchema>) =>
    z.array(
        z.string().refine(
            (value) => {
                isValidPhoneNumber(value)
                uniqueName(numbers)
            },
            {
                message: 'Invalid phone number. Please provide a valid phone number.',
            })
    );

export const parentSchema = z.object({
    familyName: z.string().min(2, 'Name must be at least 2 characters.'),
    givenName: z.string().min(2, 'Name must be at least 2 characters.'),
    phoneNumbers: phoneNumbersSchema,
    address: z.string().min(2, 'Address must be at least 2 characters.').optional()
});
