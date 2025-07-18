import { inngest } from '@/inngest/client';
import {prisma} from '@/lib/db'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import {z} from 'zod'


export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                projectId: z.string().min(1, {message: "Project ID is required"})
            })
        )
        .query( async ({ input })=> {
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
        .mutation(async ({input}) => {
           let projectId = input.projectId;
           
           // If no projectId provided, create or find a default project
           if (!projectId) {
               let defaultProject = await prisma.project.findFirst({
                   where: { name: "Default Project" }
               });
               
               if (!defaultProject) {
                   defaultProject = await prisma.project.create({
                       data: { name: "Default Project" }
                   });
               }
               
               projectId = defaultProject.id;
           }

           const createdMessage = await prisma.message.create({
                data:{
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                    projectId: projectId,
                },
            });

            await inngest.send({
                name: "code-agent/run",
                data:{
                    value: input.value,
                    projectId: projectId,
                }
            })

            return createdMessage;
        })
})