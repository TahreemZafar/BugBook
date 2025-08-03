import { z } from 'zod';


export const signUpSchema = z.object({ 
    email: z.string().trim().min(1, 'Email is required!').email('Invalid email format'),
    username: z.string().trim().min(1, 'Username is required!').regex(/^[a-zA-Z0-9_-]+$/, 
        ' Only letters, numbers, - and _ are allowed'),
    password: z.string().trim().min(1, 'Password is required!').min(6, 'Password must be at least 6 characters long')
});

export type SignUpValues = z.infer<typeof signUpSchema>;




export const signInSchema = z.object({ 
    username: z.string().trim().min(1, 'Username is required!'),
    password: z.string().trim().min(1, 'Password is required!')
});

export type SignInValues = z.infer<typeof signInSchema>;





export const createPostSchema = z.object({
    content: z.string().trim().min(1, 'Content is required!'),
    mediaId: z.array(z.string()).max(5, "Cannot have more than 5 attachments!"),
})




export const updateUserProfileSchma = z.object({
    displayName: z.string().trim().min(1, 'displayName is required!'),
    bio: z.string().max(1000, "Must be at most 1000 characters!")
})



export type updateUserProfileValues = z.infer<typeof updateUserProfileSchma>



export const createCommentSchema = z.object({
    content: z.string().trim().min(1, 'Content is required!'),
})