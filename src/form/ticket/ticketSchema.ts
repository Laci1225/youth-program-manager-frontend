import * as z from "zod";

const uniqueName = (items: { name: string }[]) =>
    z.string().refine(data => !items.map(value => value.name).includes(data), {
        message: "Name already chosen"
    });

export const ticketSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    description: z.string().min(2, 'Description must be at least 2 characters.'),
    price: z.number(),
    numberOfParticipants: z.number(),
    standardValidityPeriod: z.number(),
})
