import React, { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

export const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Node setup
    const numNodes = Math.min(60, Math.floor((width * height) / 22000));
    const nodes: Node3D[] = [];
    const focalLength = 400; // Focal length for 3D projection
    let rotationAngle = 0.001; // Tiny slow rotation angle step

    const colors = [
      "rgba(34, 211, 238, 0.75)",  // Cyan
      "rgba(139, 92, 246, 0.75)",  // Violet
      "rgba(99, 102, 241, 0.75)",  // Indigo
      "rgba(236, 72, 153, 0.65)"   // Pink
    ];

    for (let i = 0; i < numNodes; i++) {
      // Spawn nodes in a 3D box centered around (0, 0, 0)
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        vz: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[i % colors.length]
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX - width / 2;
      mouseRef.current.y = e.clientY - height / 2;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 18, 0.22)"; // Dark cosmic void trail
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid mesh in 3D perspective
      ctx.strokeStyle = "rgba(99, 102, 241, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 100;
      for (let x = -width; x < width; x += gridSize) {
        ctx.beginPath();
        for (let y = -height; y < height; y += 40) {
          // Perspective projection projection
          const pz = 400; // fake z
          const scale = focalLength / (focalLength + pz);
          const px = width / 2 + x * scale;
          const py = height / 2 + y * scale;
          if (y === -height) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Rotate nodes and apply velocities
      nodes.forEach((node) => {
        // Slow Y-axis rotation
        const cosY = Math.cos(rotationAngle);
        const sinY = Math.sin(rotationAngle);
        const rx = node.x * cosY - node.z * sinY;
        const rz = node.x * sinY + node.z * cosY;

        node.x = rx + node.vx;
        node.y = node.y + node.vy;
        node.z = rz + node.vz;

        // Bounce within boundaries
        const boundaryX = width * 0.8;
        const boundaryY = height * 0.8;
        const boundaryZ = 400;

        if (Math.abs(node.x) > boundaryX) node.vx *= -1;
        if (Math.abs(node.y) > boundaryY) node.vy *= -1;
        if (Math.abs(node.z) > boundaryZ) node.vz *= -1;

        // Interactive mouse gravity push/pull
        if (mouseRef.current.active) {
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            const force = (200 - distance) * 0.012;
            node.x += (dx / distance) * force;
            node.y += (dy / distance) * force;
          }
        }
      });

      // Sort nodes by Z value (depth representation) so background ones draw first
      const sortedNodes = [...nodes].sort((a, b) => b.z - a.z);

      // Draw connections first for depth layered correctness
      for (let i = 0; i < sortedNodes.length; i++) {
        const n1 = sortedNodes[i];
        
        // Dynamic scales for perspective sizing
        const scale1 = focalLength / (focalLength + n1.z);
        const x1 = width / 2 + n1.x * scale1;
        const y1 = height / 2 + n1.y * scale1;

        if (x1 < 0 || x1 > width || y1 < 0 || y1 > height) continue;

        for (let j = i + 1; j < sortedNodes.length; j++) {
          const n2 = sortedNodes[j];
          const scale2 = focalLength / (focalLength + n2.z);
          const x2 = width / 2 + n2.x * scale2;
          const y2 = height / 2 + n2.y * scale2;

          // Compute distance in 3D space
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dz = n1.z - n2.z;
          const d3d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (d3d < 220) {
            const alpha = (1 - d3d / 220) * 0.28 * (scale1 * scale2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            // Neon gradient connections
            const grad = ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0, n1.color.replace("0.75", String(alpha)));
            grad.addColorStop(1, n2.color.replace("0.75", String(alpha)));
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8 * scale1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      sortedNodes.forEach((node) => {
        const scale = focalLength / (focalLength + node.z);
        const x = width / 2 + node.x * scale;
        const y = height / 2 + node.y * scale;

        if (x < 0 || x > width || y < 0 || y > height) return;

        const size = Math.max(0.5, node.radius * scale);
        const glowOpacity = Math.max(0.01, 0.45 * scale);

        // draw glow shadow
        ctx.beginPath();
        const radG = ctx.createRadialGradient(x, y, 0.1, x, y, size * 5);
        radG.addColorStop(0, node.color.replace("0.75", String(glowOpacity)));
        radG.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = radG;
        ctx.arc(x, y, size * 5, 0, Math.PI * 2);
        ctx.fill();

        // draw core solid
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = node.color.replace("0.75", String(0.9 * scale));
        ctx.fill();
      });

      // Draw mathematical orbital rings for 3D tech atmosphere
      ctx.strokeStyle = "rgba(6, 182, 212, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, width * 0.35, height * 0.2, Math.PI / 6 + rotationAngle * 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(139, 92, 246, 0.04)";
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, width * 0.28, height * 0.3, -Math.PI / 4 - rotationAngle * 10, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};
