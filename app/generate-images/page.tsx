'use client';

import React, { useEffect, useRef } from 'react';
import BoardDemonstration from '../components/BoardDemonstration';

export default function GenerateImagesPage() {
  const classicRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateImage = async (ref: HTMLDivElement | null, filename: string) => {
      if (!ref) return;
      
      // Convert SVG to data URL
      const svgElement = ref.querySelector('svg');
      if (!svgElement) return;
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create image from SVG
      const img = new Image();
      img.src = svgUrl;
      await new Promise(resolve => img.onload = resolve);

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Convert to PNG and download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = pngUrl;
      link.click();

      // Cleanup
      URL.revokeObjectURL(svgUrl);
    };

    // Generate all images
    generateImage(classicRef.current, 'classic-board.png');
    generateImage(advancedRef.current, 'advanced-board.png');
    generateImage(aiRef.current, 'ai-board.png');
  }, []);

  return (
    <div style={{ padding: '20px', display: 'none' }}>
      <div ref={classicRef}>
        <BoardDemonstration mode="classic" />
      </div>
      <div ref={advancedRef}>
        <BoardDemonstration mode="advanced" />
      </div>
      <div ref={aiRef}>
        <BoardDemonstration mode="ai" />
      </div>
    </div>
  );
} 