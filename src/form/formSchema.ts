import * as z from "zod";

const nameSchema = z.string().min(2, 'Name must be at least 2 characters.');
//const dateSchema = z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Invalid date format');
const doseSchema = z.string().min(2, 'Dose must be at least 2 characters.');
export const formSchema = z.object({
    familyName: nameSchema,
    givenName: nameSchema,
    birthDate: z.any(),
    birthPlace: z.string().min(2, 'Birth Place must be at least 2 characters.'),
    address: z.string().min(2, 'Address must be at least 2 characters.'),
    diseases:
        z.array(
            z.object({
                    name: nameSchema,
                    date: nameSchema.optional(),
                }
            ),
        ),
    medicines:
        z.array(
            z.object({
                    name: nameSchema,
                    dose: doseSchema,
                    takenSince: z.string().optional(),
                }
            )
        ).optional()
})
