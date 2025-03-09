import * as z from 'zod'

export const channelCreationSchema = z.object({
  name: z.string().min(1, { message: "Channel name is required" }),
  type: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});

export const channelEditionSchema = z.object({
  name: z.string().min(1, { message: "Channel name is required" }),
});