import StarfieldAnimation from 'react-starfield-animation'

const StarAnimation = () => {
    return (
        <StarfieldAnimation
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: -1
            }}
            numParticles={100}
        />
    )
}

export default StarAnimation;