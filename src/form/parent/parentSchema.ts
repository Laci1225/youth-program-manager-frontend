import * as z from "zod";

export const parentSchema = z.object({
    familyName: z.string().min(2, 'Name must be at least 2 characters.'),
    givenName: z.string().min(2, 'Name must be at least 2 characters.'),
    phoneNumbers: z.array(
        z.string().min(2, 'Birth Place must be at least 2 characters.')
    ),
    address: z.string().min(2, 'Address must be at least 2 characters.'),
})