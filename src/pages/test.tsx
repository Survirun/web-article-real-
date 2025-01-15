"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Post-processing
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// 픽셀화 셰이더
const PixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(128, 128) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    varying vec2 vUv;
    
    void main(){
      vec2 uv = vUv * resolution;
      uv = floor(uv);
      uv = uv / resolution;
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `,
};

// 기존의 빛/색 셰이더
const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec3 vNormal;
  uniform vec3 uLightDirection;
  void main() {
    float diffuse = max(dot(normalize(vNormal), normalize(uLightDirection)), 0.0);

    vec3 baseColor = vec3(0.0);
    vec3 litColor = vec3(1.0, 0.0, 1.0);

    vec3 finalColor = mix(baseColor, litColor, diffuse);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function ThreeLightPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1) Scene & Renderer
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);

    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);

    // 2) Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);
    scene.add(camera);

    // 3) Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(3, 5, 0);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight2.position.set(0, 5, 3);
    scene.add(directionalLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // 커스텀 셰이더
    const uniforms = {
      uLightDirection: { value: directionalLight.position.clone().normalize() },
    };
    const customShaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    // 4) 모델 로드 or Fallback
    const loader = new GLTFLoader();
    let modelGroup: THREE.Group | null = null;

    loader.load(
      "/dolphin.glb",
      (gltf) => {
        modelGroup = gltf.scene;
        modelGroup?.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.material = customShaderMaterial;
          }
        });
        modelGroup?.scale.set(0.5, 0.5, 0.5);
        scene.add(modelGroup!!);
      },
      undefined,
      (error) => {
        console.warn("모델 로드 실패. 박스로 대체합니다.", error);
        modelGroup = new THREE.Group();
        const geom = new THREE.BoxGeometry(3, 2, 0.1);
        const mesh = new THREE.Mesh(geom, customShaderMaterial);
        modelGroup.add(mesh);
        scene.add(modelGroup);
      }
    );

    // 5) Post-processing 구성: Composer, Pass들
    const composer = new EffectComposer(renderer);

    // (a) RenderPass - 씬 & 카메라를 기본 렌더
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // (b) Pixelation (모자이크) Pass
    const pixelPass = new ShaderPass(PixelationShader);
    // 해상도를 64x64, 128x128 등으로 바꾸면 모자이크 정도가 달라짐
    pixelPass.uniforms.resolution.value = new THREE.Vector2(360, 360);
    composer.addPass(pixelPass);

    // (c) Bloom Pass (빛 번짐)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.0,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    composer.addPass(bloomPass);

    // 6) Mouse Move -> 모델 기울이기
    let targetRotX = 0;
    let targetRotY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const rotRange = 1.5;
      targetRotX = (y - 0.5) * rotRange;
      targetRotY = (x - 0.5) * rotRange;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 7) Animation Loop
    const animate = () => {
      if (modelGroup) {
        modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.1;
        modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.1;
      }

      // composer를 통한 후처리 렌더링
      composer.render();
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 8) Resize
    const onResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      renderer.setSize(newW, newH);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();

      composer.setSize(newW, newH);
    };
    window.addEventListener("resize", onResize);

    // 9) Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      composer.dispose();
    };
  }, []);

  return (
    <main className="w-screen h-screen relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4">
        <a
          href="/"
          className="px-3 py-2 bg-blue-700 hover:bg-blue-800 rounded text-white"
        >
          ← 홈으로
        </a>
      </div>
    </main>
  );
}
