import { inngest } from '@/inngest/client';
import {prisma} from '@/lib/db'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import {z} from 'zod'
import { TRPCError } from '@trpc/server';


export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                projectId: z.string().min(1, {message: "Project ID is required"})
            })
        )
        .query( async ({ input, ctx })=> {
            if (!ctx.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be signed in to view messages",
                });
            }

            // Verify the user owns the project
            const project = await prisma.project.findFirst({
                where: {
                    id: input.projectId,
                    userId: ctx.userId,
                },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found or access denied",
                });
            }

            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                },
                include: {
                    fragment: true
                    
                },
                orderBy: {
                    updatedAt: "asc",
                }
            })
            return messages;
        }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Message is required"}),
                projectId: z.string().min(1, {message: "Project ID is required"})
            })
        )
        .mutation(async ({input, ctx}) => {
            if (!ctx.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be signed in to create a message",
                });
            }

            // Verify the user owns the project
            const project = await prisma.project.findFirst({
                where: {
                    id: input.projectId,
                    userId: ctx.userId,
                },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found or access denied",
                });
            }

           const createdMessage = await prisma.message.create({
                data:{
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                    projectId: input.projectId,
                },
            });

            await inngest.send({
                name: "code-agent/run",
                data:{
                    value: input.value,
                    projectId: input.projectId,
                }
            })

            return createdMessage;
        })
})