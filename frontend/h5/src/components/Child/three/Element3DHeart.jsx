// Element3D.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Heart() {
  const meshRef = useRef();

  // 랜덤 초기 위치와 속도
  // 0.7 정도로 바꿨을 때 속도는 느려짐
  const velocity = useRef({
    x: (Math.random() - 0.6) * 0.03,
    y: (Math.random() - 0.6) * 0.03,
    z: 0
  });

  const colorList = [  
    "hsl(60, 97.90%, 63.30%)",  
    "hsl(120, 88.80%, 68.60%)", 
    "hsl(209, 91.20%, 73.10%)",  
    "hsl(270, 70%, 80%)", 
    "hsl(355, 80%, 85%)",
    "hsl(24, 87.10%, 75.70%)"
  ]
  const randomColor = colorList[Math.floor(Math.random()*colorList.length)]
  // console.log(randomColor)


  // 하트모양 생성(2D)
  const x = 0, y = 0;

  const heartShape = new THREE.Shape();

  heartShape.moveTo( x + 5, y + 5 );
  heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
  heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
  heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
  heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
  heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
  heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );


  // 구체를 이동시키고 반사
  useFrame((state) => {
    if (!meshRef.current) return;

    // 화면 크기 계산 (뷰포트 크기 기준)
    const frustumSize = state.camera.position.z * Math.tan(state.camera.fov * 0.5 * Math.PI / 180);
    const boundaryX = (frustumSize * state.viewport.aspect);
    const boundaryY = frustumSize;

    // 위치 업데이트
    meshRef.current.position.x += velocity.current.x;
    meshRef.current.position.y += velocity.current.y;
    meshRef.current.position.z += velocity.current.z;

    // console.log(meshRef.current.position)
    
    // 경계 체크 및 반사
    const safetyMargin = 0.8;
    if (Math.abs(meshRef.current.position.x) > boundaryX * safetyMargin) {
      velocity.current.x *= -1;
      meshRef.current.position.x = Math.sign(meshRef.current.position.x) * boundaryX * safetyMargin;
    }
    if (Math.abs(meshRef.current.position.y) > boundaryY * safetyMargin) {
      velocity.current.y *= -1;
      meshRef.current.position.y = Math.sign(meshRef.current.position.y) * boundaryY * safetyMargin;
    }
    if (Math.abs(meshRef.current.position.z) > 2) {
      velocity.current.z *= -1;
      meshRef.current.position.z = Math.sign(meshRef.current.position.z) * 2;
    }

    // 회전
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
  });

  // 마우스 오버 핸들러
  const handlePointerOver = () => {
    const angle = Math.random() * Math.PI * 2;  // 0-360도 랜덤 각도
    const speed = 0.1;                         // 전체 속도(숫자가 클수록 빠름름)
  
    velocity.current = {
      x: Math.cos(angle) * speed,               // 각도에 따른 x 속도
      y: Math.sin(angle) * speed,               // 각도에 따른 y 속도
      z: (Math.random() - 0.5) * 0.01          // 아주 작은 z축 움직임
    };
  };
  
  // 하트를 입체적으로 만들기 
  const extrudeSettings = {
    depth: 1.5,                   // 돌출 깊이
    bevelEnabled: true,           // 베벨 효과 활성화
    bevelThickness: 0.3,          // 베벨 두께
    bevelSize: 0.3,               // 베벨 크기
    bevelSegments: 3,             // 베벨 세그먼트 수
  };

  return (
    <mesh
      ref={meshRef}
      position={[
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 3
      ]}
      scale={[0.06, 0.06, 0.06]} 
      // 마우스 오버 이벤트 
      onPointerOver={handlePointerOver}
      // 그림자
      castShadow={true}
      receiveShadow={true}
    >
      {/* 반지름, 세로(값이 클수록 구체가 부드러워 보임임 ), 가로() */}
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshPhongMaterial
        color={randomColor}
        side={THREE.DoubleSide}          // 추가 : 3D객체의 면이 어느 방향에서 보여질지 결정(양면 모두 렌더링링)
        specular={0x888888}
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.1}
        shininess={150}
        opacity={0.98}
        transparent={true}
      />
    </mesh>
  );
}