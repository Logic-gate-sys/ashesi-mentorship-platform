declare module "*.css" {
  const content: any;
  export default content;
}

declare module "custom-env" {
  interface CustomEnvOptions {
    path?: string;
    env?: string;
    encoding?: string;
    defaultEnvFallback?: boolean;
  }
  
  export function env(
    envname?: string | boolean,
    dir?: string | null,
    encoding?: string | null,
    defaultEnvFallback?: boolean
  ): unknown;

  export function config(options?: CustomEnvOptions): unknown;
}