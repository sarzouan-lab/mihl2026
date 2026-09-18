import { router } from "./trpc";
import { authRouter } from "../routers/auth";
import { registrationRouter } from "../routers/registration";
import { staffRouter } from "../routers/staff";
import { gamesRouter } from "../routers/games";
import { contentRouter } from "../routers/content";
import { adminUsersRouter } from "../routers/adminUsers";
import { rosterRouter } from "../routers/roster";

export const appRouter = router({
  auth: authRouter,
  registration: registrationRouter,
  staff: staffRouter,
  games: gamesRouter,
  content: contentRouter,
  adminUsers: adminUsersRouter,
  roster: rosterRouter,
});

export type AppRouter = typeof appRouter;
