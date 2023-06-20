/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import('src/app/auth/lucia.ts').Auth
  type DatabaseUserAttributes = {
    email: string
  }
  type DatabaseSessionAttributes = {}
}
