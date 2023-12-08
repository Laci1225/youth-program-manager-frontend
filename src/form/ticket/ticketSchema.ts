import * as z from "zod";

export const ticketSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    description: z.string().min(2, 'Description must be at least 2 characters.'),
    price: z
        .string()
        .refine(value => !isNaN(parseInt(value, 10)), {
            message: 'It must be a valid number.',
        })
        .transform(value => parseInt(value, 10))
        .refine(value => value > 0, {
            message: 'It must be a positive number.',
        }),
    numberOfParticipants: z
        .string()
        .refine(value => !isNaN(parseInt(value, 10)), {
            message: 'It must be a valid number.',
        })
        .transform(value => parseInt(value, 10))
        .refine(value => value > 0, {
            message: 'It must be a positive number.',
        }),
    standardValidityPeriod: z
        .string()
        .refine(value => !isNaN(parseInt(value, 10)), {
            message: 'It must be a valid number.',
        })
        .transform(value => parseInt(value, 10))
        .refine(value => value > 0, {
            message: 'It must be a positive number.',
        }),
})
