import { router, trpcError, protectedProcedure } from "../../trpc/core";
import * as schema from "../../db/schema";
import db from "../../db/client";
import { z } from "zod";
import { protectedAdminProcedure } from "../../trpc/isAdmin";
import { eq } from "drizzle-orm";
import { calculateProratedUpgradeCost } from "./model";
export const plans = router({
  get: protectedProcedure
  .mutation(async () => {    
    const plans = await db.query.plans.findMany();
    return {
      plans
    };
  }),
    create: protectedAdminProcedure
    .input(
      z.array(z.object({
        name: z.string(),
        price: z.number()
      }))
    )
    .mutation(async ({  input }) => {
      console.log("log input" , input);
      
      // const { name , price} = input;
      // Map input planes to database format
      const planesToInsert = input.map(plane => ({
        createdAt: new Date(),
        updatedAt: new Date(),
        name: plane.name,
        price: plane.price
      }));      
      const createdPlane = await db
      .insert(schema.plans)
      .values(planesToInsert)
      .returning();
       let message = ""
        console.log("createdPlane" , createdPlane);
        
       if (createdPlane){        
        message = "Created Plane Successflly"
       }else{
        message = "Can Not Create Plane Successflly"
       }
      return {
        message:message,
        success: true,
      };
    }),
    update: protectedAdminProcedure
    .input(
      z.object({
        name: z.string(),
        price :z.number(),
        id: z.number(),
      })
    )
    .mutation(async ({  input }) => {
      
      const { id, name , price} = input;

      const update = await db
      .update(schema.plans)
        .set({
          name,
          price
        })
        .where(eq(schema.plans.id, id));
        let message =""
        console.log("update plan " , update);
        
       if (update){
        message = "Updated Plane Successflly"
       }else{
        message = "Can Not Update Plane Successflly"
       }
      return {
        message:message,
        success: true,
      };
    }),
    upgradePlan: protectedProcedure
    .input(
      z.object({
        daysRemaining: z.number().min(0).max(30), 
      })
    )
    .mutation(async ({  input }) => {
      
      const {  daysRemaining } = input;
      const currentPlan =  await db.query.plans.findFirst({
        where: eq(schema.plans.name,"Basic"),
      });    
      const newPlan = await db.query.plans.findFirst({
        where: eq(schema.plans.name,"Monthly"),
      });    
      const proratedCost = calculateProratedUpgradeCost(currentPlan?.price ?? 0, newPlan?.price ?? 0, daysRemaining);
      console.log("proratedCost" , proratedCost.toFixed(2));
      
      return {
        message:"proratedCost is" + proratedCost,
        success: true,
      };
    })
});
