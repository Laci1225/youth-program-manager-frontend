import * as z from "zod";
import {isValidPhoneNumber} from 'libphonenumber-js';

const uniquePhoneNumbers = z
    .array(z.string()
        .refine(
            (value) => isValidPhoneNumber(value),
            {
                message: 'Invalid phone number. Please provide a valid phone number.',
            }
        )
    ).refine((values: string[]) => {
        const uniqueSet = new Set(values);
        return uniqueSet.size === values.length;
    }, {
        message: 'Invalid or duplicate phone number. Please provide valid and unique phone numbers.',
    });
export const parentSchema = z.object({
    familyName: z.string().min(2, 'Name must be at least 2 characters.'),
    givenName: z.string().min(2, 'Name must be at least 2 characters.'),
    phoneNumbers: uniquePhoneNumbers,
    address: z.string().optional(),
    childId: z.string().optional()
});
