import { initTRPC, TRPCError } from "@trpc/server";
import type { Request, Response } from "express";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { getUserIdFromRequest } from "./auth";

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) {
  const userId = getUserIdFromRequest(req);
  let user = null;
  if (userId) {
    const [row] = await db.select().from(users).where(eq(users.id, userId));
    user = row ?? null;
  }
  return { req, res, user };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminProcedure = authedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
