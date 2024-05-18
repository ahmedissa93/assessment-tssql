import { router, trpcError, protectedProcedure } from "../../trpc/core";
import { z } from "zod";
import { protectedAdminProcedure } from "../../trpc/isAdmin";
import { db, schema } from "../../db/client";
import { and, desc, eq, gte, sql } from "drizzle-orm";
export const subscriptions = router({
  get: protectedProcedure
  .mutation(async () => {    
    const subscriptions = await db.query.subscriptions.findMany();
    return {
        subscriptions
    };
  }),
    create: protectedProcedure
    .input(
      z.object({
        user_id: z.number(),
        plan_id: z.number(),
        start_date:z.string(),
        end_date:z.string()
      })
    )
    .mutation(async ({  input }) => {      
      const { user_id , plan_id , start_date ,end_date} = input;
        
      const createdSubsciption = await db
      .insert(schema.subscriptions)
      .values({"user_id":user_id , "plan_id":plan_id,"start_date":start_date,"end_date":end_date,"createdAt":new Date() , "updatedAt":new Date()})
      .returning();
       let message = ""
        console.log("created Subscription" , createdSubsciption);
        
       if (createdSubsciption){        
        message = "Created Subscription Successflly"
       }else{
        message = "Can Not Create Subscription Successflly"
       }
      return {
        message:message,
        success: true,
      };
    })
});
