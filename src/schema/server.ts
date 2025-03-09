import * as z from 'zod'
export const serverCreationSchema = z.object({
    name: z.string().min(1, { message: "server name is required" }),
    image: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 4 * 1024 * 1024,
            "Profile picture must not exceed 2MB"
        )
        .refine(
            (file) =>
                !file ||
                ["image/jpeg", "image/png", "image/gif"].includes(file.type),
            "Only JPEG, PNG, and GIF images are allowed"
        ),
});

export const updateServerSchema = serverCreationSchema;

