import { initTRPC, TRPCError } from "@trpc/server";
import type { createContext } from "./context";
import { clearTokens, verifyAccessToken } from "../modules/auth/model";
const t = initTRPC.context<typeof createContext>().create();

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
export const trpcError = TRPCError;
export const createCallerFactory = t.createCallerFactory;
import { eq } from "drizzle-orm";
import db, { schema } from "../db/client";

// user procedure
const isAdmin = middleware(async({ ctx: { req, res }, next }) => {
  try {
    const { userId } = verifyAccessToken({ req });
    const userInDb = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });
      console.log("userInDb admin" , userInDb);
      
      if (userInDb && !userInDb.isAdmin){
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
    return next({
      ctx: {
        user: { userId },
      },
    });
  } catch (error) {
    console.log("error" , error);
    
    clearTokens({ res });
    throw new trpcError({
      code: "UNAUTHORIZED",
  
    });
  }
});
export const protectedAdminProcedure = publicProcedure.use(isAdmin);
