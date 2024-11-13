declare module "express-session" {
  interface SessionData {
    csrfToken?: string;
  }
}

export {};
