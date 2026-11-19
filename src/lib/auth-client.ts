import { createAuthClient } from "better-auth/react";
import {
  jwtClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000",

  plugins: [
    jwtClient(),

    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
  ],
});