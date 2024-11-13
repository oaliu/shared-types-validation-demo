# Shared Types Validation Demo

A monorepo demonstrating how to share TypeScript types and validation logic between a frontend and backend. By centralizing types and validation schemas, this approach ensures type safety, reduces duplication, and improves maintainability in full-stack applications with multiple clients like SPAs and mobile apps.

## Features

- **Types Sharing**: Centralized type definitions for consistency.
- **Validation Sharing**: Common validation logic for both client and server.
- **Monorepo Architecture**: Organized setup for seamless collaboration.
- **Frontend**: Remix (SPA).
- **Backend**: Express and mongoose.

## Project Structure

```plaintext
shared-types-validation-demo/
├── apps/
│   ├── api/               # Express backend
│   └── client/            # Remix SPA frontend
├── packages/
│   └── shared/            # Shared types and validation logic
│
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/oaliu/shared-types-validations-demo.git
   cd shared-types-validation-demo
   ```
2. Install dependencies:
   ```bash
   pnpm ci
   ```

### Running the Project

```bash
pnpm run dev
```

## Sharing Types and Validation

### Example: Shared User Type

`shared/src/types/index.ts`:

```typescript
export interface IUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Frontend** and **Backend** can import and use this type directly:

```typescript
import { IUser } from "@repo/shared";
```

### Example: Shared Validation

`shared/src/validationSchemas/forgotPasswordSchema.ts`:

```typescript
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email"),
});

export type TForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
```

- **Frontend**: Validate forms before submission.
- **Backend**: Reuse the same schema to validate API requests. And add extra validation logic as needed.

```typescript
export default class UserSignUpRequest extends RequestValidator {
  public authorized = async (): Promise<boolean> => true;

  public schema = (): ZodSchema => signUpSchema;

  public after = async (req: Request, next: NextFunction): Promise<void> => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      next(new ValidationException({ email: "Email already registered" }));
    }

    next();
  };
}
```

---

### Backend Models vs. Shared Types

In full-stack applications, the **backend** often requires a more detailed and slightly different type than the shared `IUser` type.

#### **Backend Model (`IUserModel`)**

Includes sensitive data and methods for internal use:

```typescript
interface IUserDocument extends Omit<IUser, "_id" | "createdAt" | "updatedAt"> {
  password: string;
  isVerified: boolean;
  verificationToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUserDocument, Document {
  comparePassword(
    candidatePassword: string,
    callback: (err: Error | undefined, same: boolean) => void,
  ): void;
}
```

#### **Data Transformation**

Before sending data to the frontend, sensitive fields are removed:

```typescript
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.verificationToken;
    delete ret.passwordResetToken;
    return ret;
  },
});
```

This approach ensures security while maintaining type safety and consistency across the stack.

---

### Why This Repo?

I always wondered: If I had to build an API for both a SPA and a Mobile App, would I have to duplicate types and validation schemas everywhere? That approach felt inefficient and error-prone. There had to be a better way.

This repository is a **proof of concept (POC)** showcasing how you can share types and validation logic between frontend and backend in a single codebase.

> ⚠️ **Note:** While this works as a small example, applying it to a large project may present new challenges.

Explore the code and adapt it to your needs for a deeper understanding.

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve this example.

Thank you!
