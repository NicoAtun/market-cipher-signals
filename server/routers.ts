import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import {
  getSignals,
  getSignalById,
  getLatestSignals,
  getOrCreateWebhookSettings,
  regenerateWebhookSecret,
} from "./db";

// ─── Owner-only middleware ────────────────────────────────────────────────────

const ownerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.openId !== ENV.ownerOpenId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Owner access only" });
  }
  return next({ ctx });
});

// ─── Signals router ──────────────────────────────────────────────────────────

const signalsRouter = router({
  latest: ownerProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      return getLatestSignals(input?.limit ?? 10);
    }),

  list: ownerProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        timeframe: z.enum(["15m", "4h", "daily", "weekly", "monthly"]).nullable().optional(),
        direction: z.enum(["long", "short", "watch"]).nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      return getSignals({
        limit: input.limit,
        offset: input.offset,
        timeframe: input.timeframe ?? null,
        direction: input.direction ?? null,
      });
    }),

  getById: ownerProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const signal = await getSignalById(input.id);
      if (!signal) throw new TRPCError({ code: "NOT_FOUND", message: "Signal not found" });
      return signal;
    }),
});

// ─── Webhook settings router ─────────────────────────────────────────────────

const webhookRouter = router({
  getSettings: ownerProcedure.query(async () => {
    return getOrCreateWebhookSettings();
  }),

  regenerateSecret: ownerProcedure.mutation(async () => {
    return regenerateWebhookSecret();
  }),
});

// ─── App router ──────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  signals: signalsRouter,
  webhook: webhookRouter,
});

export type AppRouter = typeof appRouter;
