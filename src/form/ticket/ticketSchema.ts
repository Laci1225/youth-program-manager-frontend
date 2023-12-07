import * as z from "zod";

export const ticketSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    description: z.string().min(2, 'Description must be at least 2 characters.'),
    price: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1)
    ),
    numberOfParticipants: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1)
    ),
    standardValidityPeriod: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1)
    ),
})
