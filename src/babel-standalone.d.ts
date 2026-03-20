declare module '@babel/standalone' {
  interface TransformOptions {
    presets?: string[];
    filename?: string;
  }

  interface TransformResult {
    code: string;
    map?: unknown;
    ast?: unknown;
  }

  function transform(code: string, options?: TransformOptions): TransformResult;

  function registerPreset(name: string, preset: unknown): void;

  const availablePresets: {
    env: unknown;
    react: unknown;
    typescript: unknown;
    [key: string]: unknown;
  };
}
