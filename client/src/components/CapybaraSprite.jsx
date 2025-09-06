import React, { useState, useEffect } from 'react';
import usePersonalizedMessages from '../hooks/usePersonalizedMessages';
import './CapybaraSprite.css';

// Animation configuration using individual frame files - SAME AS LOGIN/SIGNUP
const animations = {
    celebrate: {
        frames: ['capy_celebrate_000.png', 'capy_celebrate_001.png', 'capy_celebrate_002.png', 'capy_celebrate_003.png', 'capy_celebrate_004.png', 'capy_celebrate_005.png'],
        fps: 3
    },
    eat: {
        frames: ['capy_eat_000.png', 'capy_eat_001.png', 'capy_eat_002.png', 'capy_eat_003.png'],
        fps: 3
    },
    idle: {
        frames: ['capy_idle_000.png', 'capy_idle_001.png', 'capy_idle_002.png', 'capy_idle_003.png'],
        fps: 2
    },
    sick: {
        frames: ['capy_sick_000.png', 'capy_sick_001.png', 'capy_sick_002.png'],
        fps: 2
    },
    walk: {
        frames: ['capy_walk_000.png', 'capy_walk_001.png', 'capy_walk_002.png', 'capy_walk_003.png', 'capy_walk_004.png', 'capy_walk_005.png'],
        fps: 4
    }
};

const CapybaraSprite = ({
    currentState = 'idle',
    size = 128,
    context = 'home',
    showDescription = true,
    className = '',
    activityLog = {},
    xpScore = 50
}) => {
    const [capybaraState, setCapybaraState] = useState(currentState);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadedFrames, setLoadedFrames] = useState(new Set());

    const currentAnimation = animations[capybaraState] || animations.idle;

    // Use personalized messages
    const { currentMessage } = usePersonalizedMessages(activityLog, xpScore, context);

    // Update state when currentState prop changes
    useEffect(() => {
        setCapybaraState(currentState);
    }, [currentState]);

    // Preload all frames for the current animation
    useEffect(() => {
        const loadFrames = async () => {
            const newLoadedFrames = new Set();

            for (const frame of currentAnimation.frames) {
                try {
                    const img = new Image();
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = `/frames_resized/${frame}`;
                    });
                    newLoadedFrames.add(frame);
                } catch (error) {
                    console.error(`Failed to load frame: ${frame}`, error);
                }
            }

            setLoadedFrames(newLoadedFrames);
            setIsLoaded(newLoadedFrames.size === currentAnimation.frames.length);
        };

        loadFrames();
    }, [currentAnimation.frames]);

    // Animation loop
    useEffect(() => {
        if (!isLoaded) return;

        const interval = setInterval(() => {
            setCurrentFrame(prev => (prev + 1) % currentAnimation.frames.length);
        }, 1000 / currentAnimation.fps);

        return () => clearInterval(interval);
    }, [isLoaded, currentAnimation.fps, currentAnimation.frames.length]);

    // Reset frame when state changes
    useEffect(() => {
        setCurrentFrame(0);
    }, [capybaraState]);

    const currentFramePath = `/frames_resized/${currentAnimation.frames[currentFrame]}`;

    const getStateDescription = () => {
        switch (capybaraState) {
            case 'celebrate':
                return {
                    emoji: '🎉',
                    title: 'Celebrating!',
                    description: 'Amazing job on reaching your health goals!'
                };
            case 'eat':
                return {
                    emoji: '🥕',
                    title: 'Eating Happily',
                    description: 'Enjoying a nutritious meal!'
                };
            case 'sick':
                return {
                    emoji: '😷',
                    title: 'Feeling Unwell',
                    description: 'Need some care - check your health metrics!'
                };
            case 'walk':
                return {
                    emoji: '🚶',
                    title: 'Taking a Stroll',
                    description: 'Getting some healthy exercise!'
                };
            case 'idle':
            default:
                return {
                    emoji: '😌',
                    title: 'Feeling Peaceful',
                    description: 'Relaxing and enjoying the moment!'
                };
        }
    };

    const stateInfo = getStateDescription();

    return (
        <div className={`capybara-sprite-container ${className}`}>
            <div className="sprite-display">
                {isLoaded ? (
                    <img
                        src={currentFramePath}
                        alt={`Capybara ${capybaraState} animation`}
                        width={size}
                        height={size}
                        className="capybara-animation"
                        style={{
                            imageRendering: 'pixelated',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: '0',
                            transition: 'none'
                        }}
                    />
                ) : (
                    <div className="sprite-fallback">
                        <img
                            src="/cappy.png"
                            alt="Capybara"
                            className="fallback-image"
                            style={{ width: size, height: size }}
                        />
                    </div>
                )}
                {!isLoaded && (
                    <div className="sprite-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading capybara...</p>
                    </div>
                )}
            </div>

            {showDescription && (
                <div className="state-indicator">
                    <div className="state-emoji">{stateInfo.emoji}</div>
                    <div className="state-info">
                        <h3 className="state-title">{stateInfo.title}</h3>
                        <p className="state-description personalized-message">
                            {currentMessage || stateInfo.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CapybaraSprite;
