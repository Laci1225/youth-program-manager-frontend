import * as z from "zod";
import {childSchema} from "@/form/child/childSchema";
import {ticketTypeSchema} from "@/form/ticket-type/ticketTypeSchema";

export const ticketSchema = z.object({
    child: z.object({
        id: z.string(),
        familyName: z.string(),
        givenName: z.string(),
        birthDate: z.date()
    }),
    ticketType: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        numberOfParticipation: z.number(),
        standardValidityPeriod: z.number()
    }),
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
