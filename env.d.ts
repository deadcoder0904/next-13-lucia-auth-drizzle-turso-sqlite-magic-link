declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_PATH: string
    }
  }
}
export {}
