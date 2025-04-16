import { Canvas } from '@react-three/fiber';
import { Sphere } from './Element3D';
import { Heart } from './Element3DHeart';

const ChildMainBackground = () => {
  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0
    }}>
      <Canvas 
        style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, #DEF0FF, #FFFFFF)'}}
        camera={{ fov:75, position: [0, 0, 5], near:0.1, far:1000 }}
        gl={{ shadowMap: { enabled: true } }}
      >
        {/* 구체가 너무 칙칙해서 아래에서 추가 */}
        <ambientLight intensity={5} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#ffffff" />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />
        
        {/* 구체  */}
        {Array.from({ length: 13 }, (_, i) => (
          <Sphere key={`Sphere-${i}`} />
        ))}

        {/* 하트 */}
        {Array.from({ length: 5 }, (_, i) => (
          <Heart key={`Heart-${i}`} />
        ))}


      </Canvas>
    </div>
  );
};

export default ChildMainBackground;