import * as z from "zod";

export const medicineSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    dose: z.string().min(2, 'Dose must be at least 2 characters.'),
    takenSince: z.date().max(new Date(), 'Invalid date format').optional(),
})
export const diseaseSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    diagnosedAt: z.date().max(new Date(), 'Invalid date format')
})
export const formSchema = z.object({
    familyName: z.string().min(2, 'Name must be at least 2 characters.'),
    givenName: z.string().min(2, 'Name must be at least 2 characters.'),
    birthDate: z.date().max(new Date(), 'Invalid date format'),
    birthPlace: z.string().min(2, 'Birth Place must be at least 2 characters.'),
    address: z.string().min(2, 'Address must be at least 2 characters.'),
    diagnosedDiseases:
        z.array(
            diseaseSchema
        ),
    regularMedicines:
        z.array(
            medicineSchema
        ).optional()
})
