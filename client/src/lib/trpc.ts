import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/_core/appRouter";

export const trpc = createTRPCReact<AppRouter>();
