import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

const FullscreenImageModal = React.memo(({ src, onClose, onPrev, onNext }) => {
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowLeft' && onPrev) onPrev();
			if (e.key === 'ArrowRight' && onNext) onNext();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose, onPrev, onNext]);

	const isMobile = window.innerWidth <= 768;
	
	return createPortal(
		<div style={modalStyle} onClick={onClose} role="dialog" aria-modal="true">
			<div style={{...imageContainerWithArrowsStyle, gap: isMobile ? '0px' : '100px'}}>
				{onPrev && (
					<button
						style={{
							...arrowButtonStyle,
							left: isMobile ? '5px' : '-25px'
						}}
						onClick={(e) => { e.stopPropagation(); onPrev(); }}
					>
						&#8249;
					</button>
				)}
				<img
					src={src}
					alt="Enlarged photo"
					style={imageStyle}
					onClick={onClose}
					loading="lazy"
				/>
				{onNext && (
					<button
						style={{
							...arrowButtonStyle,
							right: isMobile ? '5px' : '-25px'
						}}
						onClick={(e) => { e.stopPropagation(); onNext(); }}
					>
						&#8250;
					</button>
				)}
			</div>
		</div>,
		document.body
	);
});

const buttonStyle = {
	background: 'none',
	border: 'none',
	fontSize: '40px',
	cursor: 'pointer',
	padding: '0 10px',
	color: 'var(--text-primary)',
	transition: '600ms',
	touchAction: 'manipulation',
	WebkitTapHighlightColor: 'transparent',
	justifyContent: 'center',
	marginBottom: '5px',
	paddingBottom: '0',
};

const imageContainerWithArrowsStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'relative',
};

const arrowButtonStyle = {
	...buttonStyle,
	padding: '0',
	position: 'absolute',
	display: 'flex',
	alignItems: 'center'
};

const modalStyle = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	width: '100vw',
	height: '100vh',
	backgroundColor: 'var(--background)',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	zIndex: 9999,
	overflow: 'hidden'
};

const imageStyle = {
	maxWidth: '90vw',
	maxHeight: '90vh',
	objectFit: 'contain',
	cursor: 'default',
	userSelect: 'none',
	WebkitUserSelect: 'none',
	msUserSelect: 'none',
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
};

const Gallery = () => {
	const [images, setImages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);

	useEffect(() => {
		const loadImages = async () => {
			const files = import.meta.glob('./images/*.(png|jpg|jpeg|svg)');
			const images = await Promise.all(
				Object.values(files).map((file) => file().then((module) => module.default))
			);
			setImages(images);
		};
		loadImages();
	}, []);

	const goToPrevious = useCallback(() =>
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		),
		[images.length]
	);

	const goToNext = useCallback(() =>
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		),
		[images.length]
	);

	const handleImageClick = useCallback(() => setIsFullscreen(true), []);
	const handleCloseFullscreen = useCallback(() => setIsFullscreen(false), []);

	const previewIndices = useMemo(() => {
		const n = images.length;
		const previewCount = Math.min(5, n);
		if (n === 0) return [];
		const start = currentIndex - Math.floor(previewCount / 2);
		return Array.from({ length: previewCount }, (_, i) => (start + i + n) % n);
	}, [images.length, currentIndex]);

	return (
		<div className="gallery-container" style={containerStyle}>
			<div style={galleryStyle}>
				<button style={buttonStyle} onClick={goToPrevious}>
					&#8249;
				</button>
				<div style={imageContainerStyle}>
					{images.length > 0 && (
						<img
							src={images[currentIndex]}
							alt={`Image ${currentIndex + 1} of ${images.length}`}
							style={galleryImageStyle}
							onClick={handleImageClick}
							loading="lazy"
						/>
					)}
				</div>
				<button style={buttonStyle} onClick={goToNext}>
					&#8250;
				</button>
			</div>
			<div style={previewContainerStyle}>
			{previewIndices.map((index) =>
					images[index] ? (
						<img
							key={index}
							src={images[index]}
							alt={`Preview ${index + 1}`}
							style={{
								...previewImageStyle,
								...(index === currentIndex ? selectedPreviewStyle : {}),
							}}
							onClick={() => setCurrentIndex(index)}
							loading="lazy"
						/>
					) : null
				)}
			</div>
			{isFullscreen && (
				<FullscreenImageModal
					src={images[currentIndex]}
					onClose={handleCloseFullscreen}
					onPrev={goToPrevious}
					onNext={goToNext}
				/>
			)}
		</div>
	);
};

const galleryStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: 'auto',
};

const imageContainerStyle = {
	display: 'flex',
	justifyContent: 'center',
	overflow: 'hidden',
	width: '60vh',
	height: '60vh',
	maxWidth: '80vw',
	maxHeight: '80vw',
	minWidth: '280px',
	minHeight: '280px',
};

const galleryImageStyle = {
	cursor: 'pointer',
	objectFit: 'contain',
	width: '100%',
	height: '100%',
};

const previewContainerStyle = {
	display: 'flex',
	marginTop: 10,
};

const previewImageStyle = {
	opacity: 0.6,
	width: 'clamp(40px, 8vh, 80px)',
	height: 'clamp(40px, 8vh, 80px)',
	cursor: 'pointer',
	objectFit: 'contain',
	boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
	flexShrink: 0,
	margin: '0 5px',
};

const selectedPreviewStyle = { opacity: 1 };

export default Gallery;
