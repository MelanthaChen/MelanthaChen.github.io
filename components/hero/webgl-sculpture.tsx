"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Vec3 = [number, number, number];

function makeSculpture(rows = 26, columns = 48) {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const point = (row: number, column: number): Vec3 => {
    const theta = (row / rows) * Math.PI;
    const phi = (column / columns) * Math.PI * 2;
    const ripple = 1 + 0.12 * Math.sin(phi * 3 + theta * 2) + 0.07 * Math.cos(theta * 5 - phi * 2);
    const lean = 0.12 * Math.sin(theta) * Math.sin(phi * 2);
    return [Math.sin(theta) * Math.cos(phi) * ripple + lean, Math.cos(theta) * ripple, Math.sin(theta) * Math.sin(phi) * ripple];
  };
  for (let row = 0; row <= rows; row += 1) for (let column = 0; column <= columns; column += 1) {
    const p = point(row, column); const length = Math.hypot(...p);
    positions.push(...p); normals.push(p[0] / length, p[1] / length, p[2] / length);
  }
  for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
    const next = row * (columns + 1) + column; const below = (row + 1) * (columns + 1) + column;
    indices.push(next, below, next + 1, next + 1, below, below + 1);
  }
  return { positions, normals, indices };
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const item = gl.createShader(type);
  if (!item) throw new Error("Unable to create WebGL shader");
  gl.shaderSource(item, source); gl.compileShader(item);
  if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(item) || "WebGL shader compilation failed");
  return item;
}

export function WebglSculpture({ reducedMotion, className }: { reducedMotion: boolean | null; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [contextRevision, setContextRevision] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fallback = fallbackRef.current;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, powerPreference: "high-performance" });
    if (!gl) { fallback?.setAttribute("data-active", "true"); return; }
    try {
      const vertex = compileShader(gl, gl.VERTEX_SHADER, `attribute vec3 aPosition; attribute vec3 aNormal; uniform float uTime; uniform vec2 uRotation; uniform float uAspect; varying vec3 vNormal; varying vec3 vPosition; mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,-s,0.,s,c);} mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,s,0.,1.,0.,-s,0.,c);} void main(){mat3 rotation=rotX(uRotation.y)*rotY(uRotation.x);vec3 p=rotation*aPosition;vec3 n=normalize(rotation*aNormal);p*=1.+sin(uTime*.7+p.y*3.)*.025;vPosition=p;vNormal=n;float camera=3.35;vec2 projected=p.xy/(camera-p.z);gl_Position=vec4(projected.x*1.48/uAspect,projected.y*1.48,p.z/camera,1.);}`);
      const fragment = compileShader(gl, gl.FRAGMENT_SHADER, `precision mediump float; uniform float uTime; varying vec3 vNormal; varying vec3 vPosition; void main(){vec3 light=normalize(vec3(-.45,.7,1.));float diffuse=max(dot(vNormal,light),0.);float rim=pow(1.-max(dot(vNormal,vec3(0.,0.,1.)),0.),2.);float bands=sin(vPosition.y*4.+uTime*.45)*.5+.5;vec3 color=mix(vec3(.65,.48,1.),vec3(.22,.68,.95),bands);color=mix(color,vec3(1.,.62,.72),rim*.42);color*=.36+diffuse*.82;gl_FragColor=vec4(color,.96);}`);
      const program = gl.createProgram();
      if (!program) throw new Error("Unable to create WebGL program");
      gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "WebGL program linking failed");
      const data = makeSculpture(); const position = gl.createBuffer(); const normal = gl.createBuffer(); const index = gl.createBuffer();
      if (!position || !normal || !index) throw new Error("Unable to allocate WebGL buffers");
      gl.bindBuffer(gl.ARRAY_BUFFER, position); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, normal); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normals), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
      const positionLocation = gl.getAttribLocation(program, "aPosition"); const normalLocation = gl.getAttribLocation(program, "aNormal");
      const timeLocation = gl.getUniformLocation(program, "uTime"); const rotationLocation = gl.getUniformLocation(program, "uRotation"); const aspectLocation = gl.getUniformLocation(program, "uAspect");
      const target = { x: 0, y: 0 }; const rotation = { x: 0, y: 0 }; const drag = { active: false, x: 0, y: 0 }; let frame = 0; let running = false; let start = performance.now(); let visible = true;
      const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 1.5); const bounds = canvas.getBoundingClientRect(); canvas.width = Math.max(1, Math.floor(bounds.width * ratio)); canvas.height = Math.max(1, Math.floor(bounds.height * ratio)); gl.viewport(0, 0, canvas.width, canvas.height); draw(performance.now()); };
      const draw = (now: number) => { const seconds = reducedMotion ? 0 : (now - start) / 1000; rotation.x += (target.x - rotation.x) * .08; rotation.y += (target.y - rotation.y) * .08; gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST); gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, position); gl.enableVertexAttribArray(positionLocation); gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0); gl.bindBuffer(gl.ARRAY_BUFFER, normal); gl.enableVertexAttribArray(normalLocation); gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index); gl.uniform1f(timeLocation, seconds); gl.uniform2f(rotationLocation, rotation.x, rotation.y); gl.uniform1f(aspectLocation, canvas.width / canvas.height); gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0); };
      const schedule = () => { if (running || !visible) return; running = true; const tick = (now: number) => { if (!running) return; draw(now); if (reducedMotion) { running = false; return; } frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); };
      const stop = () => { running = false; cancelAnimationFrame(frame); };
      const onVisibility = () => { visible = !document.hidden; if (visible) schedule(); else stop(); };
      const onPointerDown = (event: PointerEvent) => { drag.active = true; drag.x = event.clientX; drag.y = event.clientY; canvas.setPointerCapture(event.pointerId); };
      const onPointerMove = (event: PointerEvent) => { if (!drag.active) return; target.x += (event.clientX - drag.x) * .008; target.y = Math.max(-.65, Math.min(.65, target.y + (event.clientY - drag.y) * .006)); drag.x = event.clientX; drag.y = event.clientY; schedule(); };
      const onPointerUp = (event: PointerEvent) => { drag.active = false; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && !document.hidden; if (visible) schedule(); else stop(); }, { threshold: .05 });
      const onContextLost = (event: Event) => { event.preventDefault(); stop(); fallback?.setAttribute("data-active", "true"); };
      const onContextRestored = () => setContextRevision((value) => value + 1);
      fallback?.removeAttribute("data-active"); resize(); observer.observe(canvas); schedule(); window.addEventListener("resize", resize); document.addEventListener("visibilitychange", onVisibility); canvas.addEventListener("pointerdown", onPointerDown); canvas.addEventListener("pointermove", onPointerMove); canvas.addEventListener("pointerup", onPointerUp); canvas.addEventListener("pointercancel", onPointerUp); canvas.addEventListener("webglcontextlost", onContextLost); canvas.addEventListener("webglcontextrestored", onContextRestored);
      return () => { stop(); observer.disconnect(); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVisibility); canvas.removeEventListener("pointerdown", onPointerDown); canvas.removeEventListener("pointermove", onPointerMove); canvas.removeEventListener("pointerup", onPointerUp); canvas.removeEventListener("pointercancel", onPointerUp); canvas.removeEventListener("webglcontextlost", onContextLost); canvas.removeEventListener("webglcontextrestored", onContextRestored); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment); gl.deleteBuffer(position); gl.deleteBuffer(normal); gl.deleteBuffer(index); };
    } catch (error) { console.warn("WebGL sculpture unavailable; using fallback.", error); fallback?.setAttribute("data-active", "true"); }
  }, [reducedMotion, contextRevision]);

  return <div className={cn("webgl-sculpture", className)}><canvas ref={canvasRef} aria-label="Interactive iridescent 3D sculpture" /><div ref={fallbackRef} className="webgl-fallback" aria-hidden="true"><div /></div><div className="webgl-sculpture__caption"><span>interactive study</span><span>drag / rotate</span></div></div>;
}
