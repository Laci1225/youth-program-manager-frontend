import * as z from "zod";

const uniqueName = (items: { name: string }[]) =>
    z.string().refine(data => !items.map(value => value.name).includes(data), {
        message: "Name already chosen"
    });

export const medicineSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    dose: z.string().min(2, 'Dose must be at least 2 characters.'),
    takenSince: z.date().max(new Date(), 'Invalid date format').optional(),
})

export const getMedicineSchema = (medicines: z.infer<typeof medicineSchema>[]) => z.object({
    name: uniqueName(medicines),
    dose: z.string().min(2, 'Dose must be at least 2 characters.'),
    takenSince: z.date().max(new Date(), 'Invalid date format').optional(),
})
export const diseaseSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    diagnosedAt: z.date().max(new Date(), 'Invalid date format')
})
export const getDiseaseSchema = (diseases: z.infer<typeof diseaseSchema>[]) =>
    z.object({
        name: uniqueName(diseases),
        diagnosedAt: z.date().max(new Date(), 'Invalid date format')
    })

export const childSchema = z.object({
    familyName: z.string().min(2, 'Name must be at least 2 characters.'),
    givenName: z.string().min(2, 'Name must be at least 2 characters.'),
    birthDate: z.date().max(new Date(), 'Invalid date format'),
    birthPlace: z.string().min(2, 'Birth Place must be at least 2 characters.'),
    address: z.string().min(2, 'Address must be at least 2 characters.'),
    relativeParent:
        z.object({
                id: z.string(),
                email: z.string().email('Invalid email address.').optional(),//todo not optional
                familyName: z.string(),
                givenName: z.string(),
                phoneNumbers: z.array(z.string()),
                address: z.string().optional(),
                isEmergencyContact: z.boolean()
            }
        ).optional(),
    diagnosedDiseases:
        z.array(
            diseaseSchema
        ).optional(),
    regularMedicines:
        z.array(
            medicineSchema
        ).optional()
})
