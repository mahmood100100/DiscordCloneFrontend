import * as z from 'zod';

export const createMessageSchema = z.object({
  content: z.string().min(1, { message: "Message content is required" }),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 4 * 1024 * 1024,
      { message: "File size must be less than or equal to 4MB" }
    ),
});

export const editMessageSchema = createMessageSchema;