import React, { useState, useEffect, useRef } from 'react';

// Use the exact same configuration as capy_atlas.json
const capyAtlas = {
  "frame_size": [64, 64],
  "atlas_size": [512, 512],
  "columns": 8,
  "animations": {
    "celebrate": {"start_index": 0, "count": 6, "fps": 3},
    "eat": {"start_index": 6, "count": 4, "fps": 3},
    "idle": {"start_index": 10, "count": 4, "fps": 2},
    "sick": {"start_index": 14, "count": 3, "fps": 2},
    "walk": {"start_index": 17, "count": 6, "fps": 4}
  }
};

const CapyCanvas = ({ 
    state = 'idle', 
    size = 128, 
    className = '' 
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const frameIndexRef = useRef(0);
    const lastFrameTimeRef = useRef(0);
    const spriteImageRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load sprite sheet
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            console.log('CapyCanvas: Sprite sheet loaded successfully');
            spriteImageRef.current = img;
            setIsLoaded(true);
        };
        img.onerror = (error) => {
            console.error('CapyCanvas: Failed to load sprite sheet:', error);
            console.error('CapyCanvas: Attempted to load from:', '/capy_atlas.png');
            setIsLoaded(false);
        };
        img.src = '/capy_atlas.png';
        console.log('CapyCanvas: Attempting to load sprite sheet from:', '/capy_atlas.png');
    }, []);

    // Animation loop
    useEffect(() => {
        if (!isLoaded || !canvasRef.current || !spriteImageRef.current) {
            console.log('CapyCanvas: Animation not ready - isLoaded:', isLoaded, 'canvas:', !!canvasRef.current, 'sprite:', !!spriteImageRef.current);
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const animation = capyAtlas.animations[state];
        
        if (!animation) {
            console.error('CapyCanvas: No animation found for state:', state);
            return;
        }

        console.log('CapyCanvas: Starting animation for state:', state, 'animation:', animation);

        const animate = (currentTime) => {
            const deltaTime = currentTime - lastFrameTimeRef.current;
            const frameDuration = 1000 / animation.fps;

            if (deltaTime >= frameDuration) {
                // Clear canvas with transparent background
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Calculate current frame
                const frameIndex = animation.start_index + (frameIndexRef.current % animation.count);
                
                // Calculate sprite position in atlas
                const col = frameIndex % capyAtlas.columns;
                const row = Math.floor(frameIndex / capyAtlas.columns);
                const [frameWidth, frameHeight] = capyAtlas.frame_size;
                
                const srcX = col * frameWidth;
                const srcY = row * frameHeight;

                // Draw sprite frame
                ctx.drawImage(
                    spriteImageRef.current,
                    srcX, srcY, frameWidth, frameHeight,
                    0, 0, canvas.width, canvas.height
                );

                // Update frame index
                frameIndexRef.current = (frameIndexRef.current + 1) % animation.count;
                lastFrameTimeRef.current = currentTime;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isLoaded, state]);

    // Reset frame index when state changes
    useEffect(() => {
        frameIndexRef.current = 0;
    }, [state]);

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className={className}
            style={{
                imageRendering: 'pixelated',
                imageRendering: '-moz-crisp-edges',
                imageRendering: 'crisp-edges'
            }}
        />
    );
};

export default CapyCanvas;
