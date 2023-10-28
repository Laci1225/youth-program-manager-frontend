import * as z from "zod";

const nameSchema = z.string().min(2, 'Name must be at least 2 characters.');
const dateSchema = z.date().max(new Date(),'Invalid date format');
const doseSchema = z.string().min(2, 'Dose must be at least 2 characters.');
export const formSchema = z.object({
    familyName: nameSchema,
    givenName: nameSchema,
    birthDate: dateSchema,
    birthPlace: z.string().min(2, 'Birth Place must be at least 2 characters.'),
    address: z.string().min(2, 'Address must be at least 2 characters.'),
    diagnosedDiseases:
        z.array(
            z.object({
                    //id: z.number(),
                    name: nameSchema,
                    diagnosedAt: dateSchema
                }
            ),
        ),
    regularMedicines:
        z.array(
            z.object({
                    name: nameSchema,
                    dose: doseSchema,
                    takenSince: z.any().optional(),
                }
            )
        ).optional()
})
export const medicineSchema = z.object({
    regularMedicines:
        z.array(
            z.object({
                    name: nameSchema,
                    dose: doseSchema,
                    takenSince: z.any().optional(),
                }
            )
        ).optional()
})
export const diseaseSchema = z.object({
    diagnosedDiseases:
        z.array(
            z.object({
                    //id: z.number(),
                    name: nameSchema,
                    diagnosedAt: dateSchema
                }
            ),
        ),
})