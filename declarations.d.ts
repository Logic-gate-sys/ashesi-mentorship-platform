declare module "*.css" {
  const content: any;
  export default content;
}

declare module "custom-env" {
  interface CustomEnvOptions {
    path?: string;
    env?: string;
    encoding?: string;
  }
  
  export function config(options?: CustomEnvOptions): void;
}