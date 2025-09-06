import React, { useState, useEffect } from 'react';

const CapyAnimation = ({
    state = 'idle',
    size = 128,
    className = ''
}) => {
    const [currentFrame, setCurrentFrame] = useState(0);

    // Frame configurations based on your frames_resized folder
    const animations = {
        idle: {
            frames: ['capy_idle_000.png', 'capy_idle_001.png', 'capy_idle_002.png', 'capy_idle_003.png'],
            fps: 1
        },
        eat: {
            frames: ['capy_eat_000.png', 'capy_eat_001.png', 'capy_eat_002.png', 'capy_eat_003.png'],
            fps: 2
        },
        walk: {
            frames: ['capy_walk_000.png', 'capy_walk_001.png', 'capy_walk_002.png', 'capy_walk_003.png', 'capy_walk_004.png', 'capy_walk_005.png'],
            fps: 2
        },
        celebrate: {
            frames: ['capy_celebrate_000.png', 'capy_celebrate_001.png', 'capy_celebrate_002.png', 'capy_celebrate_003.png', 'capy_celebrate_004.png', 'capy_celebrate_005.png'],
            fps: 1
        },
        sick: {
            frames: ['capy_sick_000.png', 'capy_sick_001.png', 'capy_sick_002.png'],
            fps: 0.5
        }
    };

    const currentAnimation = animations[state] || animations.idle;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame(prev => (prev + 1) % currentAnimation.frames.length);
        }, 1000 / currentAnimation.fps);

        return () => clearInterval(interval);
    }, [currentAnimation.fps, currentAnimation.frames.length]);

    // Reset frame when state changes
    useEffect(() => {
        setCurrentFrame(0);
    }, [state]);

    const currentFramePath = `/frames_resized/${currentAnimation.frames[currentFrame]}`;

    return (
        <img
            src={currentFramePath}
            alt={`Capybara ${state} animation`}
            width={size}
            height={size}
            className={className}
            style={{
                imageRendering: 'pixelated'
            }}
        />
    );
};

export default CapyAnimation;

