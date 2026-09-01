import { useRef, useEffect } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface InfiniteDriftBand {
  images: string[];
  speed?: number;
  rotation?: number;
  offsetY?: number;
  curveAmount?: number;
  curveDirection?: 1 | -1;
  rotationType?: "fromLeft" | "fromCenter";
}

export interface InfiniteDriftProps {
  bands?: InfiniteDriftBand[];
  height?: string | number;
  gap?: number;
  imageHeight?: number;
  bandHeight?: number;
  maxImageWidth?: number;
  inertia?: number;
  preserveOriginalRatios?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function InfiniteDrift({
  bands = [],
  height = 600,
  gap = 20,
  imageHeight = 100,
  bandHeight = 120,
  maxImageWidth = 300,
  inertia = 0.92,
  preserveOriginalRatios = true,
  className,
  children,
}: InfiniteDriftProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollState = useRef({
    scrollY: 0,
    targetScrollY: 0,
    scrollVelocity: 0,
    isDragging: false,
    lastMouseY: 0,
  });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(dpr);

    const meshes: THREE.Mesh[] = [];
    const materials: THREE.ShaderMaterial[] = [];

    const createBandTexture = async (band: InfiniteDriftBand) => {
      const images: HTMLImageElement[] = await Promise.all(
        band.images.map(
          (url) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = () => {
                const fallback = document.createElement("canvas");
                fallback.width = 400;
                fallback.height = 300;
                const ctx = fallback.getContext("2d")!;
                ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
                ctx.fillRect(0, 0, 400, 300);
                resolve(fallback as unknown as HTMLImageElement);
              };
              img.src = url;
            }),
        ),
      );

      let sequenceWidth = 0;
      const imageInfos = images.map((img) => {
        const ratio = img.naturalWidth / img.naturalHeight || 1.5;
        let w: number, h: number;
        if (preserveOriginalRatios) {
          h = imageHeight;
          w = Math.round(h * ratio);
          if (w > maxImageWidth) {
            w = maxImageWidth;
            h = Math.round(w / ratio);
          }
        } else {
          h = imageHeight;
          w = Math.round(h * 1.5);
        }
        sequenceWidth += w + gap;
        return { img, w, h };
      });
      sequenceWidth -= gap;

      const cloneCount = 3;
      const totalWidth = sequenceWidth * cloneCount;
      const offscreenCanvas = document.createElement("canvas");
      // Backing store is rasterized at `dpr` real pixels per layout pixel so the
      // texture has enough data to render sharply once the GPU magnifies it to
      // fill the (also dpr-scaled) output framebuffer — same reasoning as
      // `renderer.setPixelRatio` above, just applied to this offscreen texture.
      // `totalWidth`/`sequenceWidth`/`bandHeight` themselves stay in layout-pixel
      // units below and are returned unchanged — the shader's scroll/UV math
      // uses those against `uResolution` (also layout pixels), so scaling only
      // the canvas's pixel buffer (not these values) can't affect scroll speed,
      // wrapping, or on-screen size, only how much texture detail backs it.
      offscreenCanvas.width = totalWidth * dpr;
      offscreenCanvas.height = bandHeight * dpr;
      const ctx = offscreenCanvas.getContext("2d")!;
      ctx.scale(dpr, dpr);

      let currentX = 0;
      for (let c = 0; c < cloneCount; c++) {
        imageInfos.forEach((info) => {
          const centeredY = (bandHeight - info.h) / 2;
          ctx.drawImage(info.img, currentX, centeredY, info.w, info.h);
          currentX += info.w + gap;
        });
      }

      const texture = new THREE.Texture(offscreenCanvas);
      texture.needsUpdate = true;
      return { texture, totalWidth, sequenceWidth };
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 uResolution;
      uniform sampler2D uTexture;
      uniform float uTextureWidth;
      uniform float uSequenceWidth;
      uniform float uBandHeight;
      uniform float uScroll;
      uniform float uSpeed;
      uniform float uOffsetY;
      uniform float uRotation;
      uniform float uRotationType;
      uniform float uHasRotation;
      uniform float uCurveAmount;
      uniform float uCurveDirection;
      varying vec2 vUv;

      mat2 rotate2d(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      }

      void main() {
        vec2 pixelCoord = vUv * uResolution;
        vec2 originalPixelCoord = pixelCoord;

        float normalizedX = pixelCoord.x / uResolution.x;
        float curveFactor = 4.0 * (normalizedX - 0.5) * (normalizedX - 0.5);
        float curveOffset = (0.5 - curveFactor) * uCurveAmount * uCurveDirection;

        float bandTopBase = (uResolution.y - uBandHeight) * 0.5 + uOffsetY;
        float bandTop = bandTopBase + curveOffset;
        float bandBottom = bandTop + uBandHeight;
        float bandCenterY = bandTopBase + (uBandHeight * 0.5);

        if (uHasRotation > 0.5) {
          vec2 rotationCenter = (uRotationType > 0.5) ? vec2(0.0, bandCenterY) : vec2(uResolution.x * 0.5, bandCenterY);
          pixelCoord -= rotationCenter;
          pixelCoord = rotate2d(uRotation) * pixelCoord;
          pixelCoord += rotationCenter;
          originalPixelCoord -= rotationCenter;
          originalPixelCoord = rotate2d(uRotation) * originalPixelCoord;
          originalPixelCoord += rotationCenter;
        }

        float margin = 3.0;
        if (pixelCoord.y < bandTop - margin || pixelCoord.y > bandBottom + margin) {
          discard;
        }

        float scrollPos = uScroll * uSpeed;
        float wrappedX = mod(originalPixelCoord.x + scrollPos, uSequenceWidth);
        float textureX = (wrappedX + uSequenceWidth) / uTextureWidth;
        float texY = (pixelCoord.y - bandTop) / (bandBottom - bandTop);

        if (textureX < 0.0 || textureX > 1.0 || texY < 0.0 || texY > 1.0) {
          discard;
        }

        vec4 color = texture2D(uTexture, vec2(textureX, texY));
        if (color.a < 0.1) discard;

        float edge = min(pixelCoord.y - bandTop, bandBottom - pixelCoord.y);
        if (edge < margin) color.a *= smoothstep(0.0, margin, edge);

        gl_FragColor = color;
      }
    `;

    const initBands = async () => {
      for (let i = 0; i < bands.length; i++) {
        const config = bands[i];
        const { texture, totalWidth, sequenceWidth } = await createBandTexture(config);

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uResolution: {
              value: new THREE.Vector2(container.clientWidth, container.clientHeight),
            },
            uTexture: { value: texture },
            uTextureWidth: { value: totalWidth },
            uSequenceWidth: { value: sequenceWidth },
            uBandHeight: { value: bandHeight },
            uScroll: { value: 0 },
            uSpeed: { value: config.speed || 1.0 },
            uOffsetY: { value: config.offsetY || 0 },
            uRotation: { value: ((config.rotation || 0) * Math.PI) / 180 },
            uRotationType: { value: config.rotationType === "fromLeft" ? 1.0 : 0.0 },
            uHasRotation: { value: config.rotation ? 1.0 : 0.0 },
            uCurveAmount: { value: config.curveAmount || 0 },
            uCurveDirection: { value: config.curveDirection || 1 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = i * -0.01;
        scene.add(mesh);
        meshes.push(mesh);
        materials.push(material);
      }
    };

    initBands();

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const state = scrollState.current;

      if (!state.isDragging) {
        state.targetScrollY += state.scrollVelocity;
        state.scrollVelocity *= inertia;
        if (Math.abs(state.scrollVelocity) < 0.1) state.scrollVelocity = 0;
      }

      state.scrollY += (state.targetScrollY - state.scrollY) * 0.1;

      materials.forEach((mat) => {
        mat.uniforms["uScroll"].value = state.scrollY;
        mat.uniforms["uResolution"].value.set(container.clientWidth, container.clientHeight);
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollState.current.targetScrollY += e.deltaY;
      scrollState.current.scrollVelocity = e.deltaY * 0.15;
    };

    let lastScrollTop = window.scrollY;
    const handleGlobalScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollTop;
      lastScrollTop = current;
      scrollState.current.targetScrollY += delta * 2.5;
      scrollState.current.scrollVelocity = delta * 0.3;
    };

    const handleMouseDown = (e: MouseEvent) => {
      scrollState.current.isDragging = true;
      scrollState.current.lastMouseY = e.clientY;
      scrollState.current.scrollVelocity = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!scrollState.current.isDragging) return;
      const deltaY = e.clientY - scrollState.current.lastMouseY;
      scrollState.current.targetScrollY += deltaY * 2.0;
      scrollState.current.lastMouseY = e.clientY;
      scrollState.current.scrollVelocity = deltaY * 0.25;
    };

    const handleMouseUp = () => {
      scrollState.current.isDragging = false;
    };

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      materials.forEach((mat) => {
        mat.uniforms["uResolution"].value.set(container.clientWidth, container.clientHeight);
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleGlobalScroll, { passive: true });

    const handleTouchStart = (e: TouchEvent) => {
      scrollState.current.lastMouseY = e.touches[0].clientY;
      scrollState.current.isDragging = true;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!scrollState.current.isDragging) return;
      const deltaY = e.touches[0].clientY - scrollState.current.lastMouseY;
      scrollState.current.targetScrollY += deltaY * 2.5;
      scrollState.current.lastMouseY = e.touches[0].clientY;
      scrollState.current.scrollVelocity = deltaY * 0.3;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleGlobalScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleMouseUp);
      meshes.forEach((m) => {
        scene.remove(m);
        m.geometry.dispose();
        (m.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
    };
  }, [bands, gap, imageHeight, bandHeight, maxImageWidth, inertia, preserveOriginalRatios]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden cursor-grab active:cursor-grabbing rounded-2xl",
        className,
      )}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {children}
    </div>
  );
}
