declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      src?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      style?: string | Record<string, string | number>;
      class?: string;
      id?: string;
      [key: string]: any;
    };
  }
}
