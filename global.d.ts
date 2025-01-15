declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Loader } from 'three';
  
    // 필요한 타입들만 간략히 선언 (예시)
    export class GLTFLoader extends Loader {
      constructor();
      load(
        url: string,
        onLoad: (gltf: any) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
    }
  }