function LoadingScreen() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: '0.75rem',
                fontFamily: 'Inter, Arial, sans-serif',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary, #000)',
                backgroundColor: 'var(--background, #fff)'
            }}
        >
            <span
                aria-label="Loading"
                style={{
                    width: '0.8rem',
                    height: '0.8rem',
                    borderRadius: '50%',
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite'
                }}
            />
            <span>Loading...</span>
        </div>
    );
}

export default LoadingScreen;
