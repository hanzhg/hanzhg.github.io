import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const FullscreenImage = ({ src, onClose }) => {
    return createPortal(
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <img 
                src={src} 
                alt="fullscreen" 
                style={{ maxHeight: '95%', maxWidth: '95%' }}
            />
        </div>,
        document.body
    );
};

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            const images = [];
            const files = import.meta.glob('../images/*.(png|jpg|jpeg|svg)');
            for (const path in files) {
                const module = await files[path]();
                images.push(module.default);
            }
            setImages(images);
        };
        loadImages();
    }, []);

    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const getPreviewImages = () => {
        const previewCount = Math.min(5, images.length);
        const offset = Math.floor(previewCount / 2);
        let previewIndexes = [];
        
        for (let i = -offset; i <= offset; i++) {
            let index = currentIndex + i;
            if (index < 0) index = images.length + index;
            if (index >= images.length) index = index - images.length;
            previewIndexes.push(index);
        }
        
        if (previewIndexes.length < previewCount) {
            for (let i = previewIndexes.length; i < previewCount; i++) {
                previewIndexes.push((currentIndex + i) % images.length);
            }
        }
        
        return previewIndexes;
    };

    const handleImageClick = () => {
        setIsFullscreen(true);
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div>
                <button 
                    onClick={goToPrevious}
                    style={{
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        fontSize: '50px',
                        opacity: 0.6,
                        transition: 'opacity 0.3s'
                    }}
                    onMouseOver={e => e.target.style.opacity = 1}
                    onMouseOut={e => e.target.style.opacity = 0.6}
                >
                    &#8249;
                </button>
                <img 
                    src={images[currentIndex]} 
                    alt="gallery" 
                    className="gallery-image"
                    style={{ maxWidth: '60vh', width: '80vw', cursor: 'pointer' }}
                    onClick={handleImageClick}
                />
                <button 
                    onClick={goToNext}
                    style={{
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        fontSize: '50px',
                        opacity: 0.6,
                        transition: 'opacity 0.3s'
                    }}
                    onMouseOver={e => e.target.style.opacity = 1}
                    onMouseOut={e => e.target.style.opacity = 0.6}
                >
                    &#8250;
                </button>
            </div>
            <div className="preview-strip" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {getPreviewImages().map((index) => (
                    images[index] && (
                        <img
                            key={`${index}-${images[index].split('/').pop()}-${Date.now()}`}
                            src={images[index]}
                            alt={`preview-${index}`}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                border: index === currentIndex ? '2px solid #007bff' : 'none',
                                opacity: index === currentIndex ? 1 : 0.6
                            }}
                            onClick={() => setCurrentIndex(index)}
                        />
                    )
                ))}
            </div>
            {isFullscreen && (
                <FullscreenImage 
                    src={images[currentIndex]} 
                    onClose={handleCloseFullscreen} 
                />
            )}
        </div>
    );
};

export default Gallery;