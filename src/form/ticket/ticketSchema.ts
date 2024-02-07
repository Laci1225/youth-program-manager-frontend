import * as z from "zod";

export const ticketSchema = z.object({
    childId: z.string(),
    ticketTypeId: z.string(),
    issueDate: z.date(),
    expirationDate: z.date(),
    price: z
        .any()
        .transform(value => value.toString())
        .refine(value => !isNaN(parseInt(value, 10)), {
            message: 'It must be a valid number.',
        })
        .transform(value => parseInt(value, 10))
        .refine(value => value > 0, {
            message: 'It must be a positive number.',
        }),
    numberOfParticipation: z
        .any()
        .transform(value => value.toString())
        .refine(value => !isNaN(parseInt(value, 10)), {
            message: 'It must be a valid number.',
        })
        .transform(value => parseInt(value, 10))
        .refine(value => value > 0, {
            message: 'It must be a positive number.',
        }),
})
