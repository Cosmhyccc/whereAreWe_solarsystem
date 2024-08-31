import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Sparkles, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

function Planet({ name, color, size, orbitRadius, orbitSpeed, rotationSpeed, facts }) {
  const mesh = useRef()
  const orbit = useRef()
  const [active, setActive] = useState(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    orbit.current.rotation.y = t * orbitSpeed
    mesh.current.rotation.y += rotationSpeed
  })

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(size, 1), [size])

  const positionOnOrbit = useMemo(() => {
    const angle = Math.random() * Math.PI * 2
    return [Math.cos(angle) * orbitRadius, (Math.random() - 0.5) * 2, Math.sin(angle) * orbitRadius]
  }, [orbitRadius])

  return (
    <group ref={orbit}>
      <mesh 
        ref={mesh} 
        geometry={geometry} 
        position={positionOnOrbit}
        onClick={() => setActive(!active)}
      >
        <meshLambertMaterial color={color} wireframe />
      </mesh>
      <Sparkles count={50} scale={[orbitRadius*2, 0.5, orbitRadius*2]} size={0.5} speed={0.3} />
      <Text
        position={[positionOnOrbit[0], positionOnOrbit[1] + size + 0.5, positionOnOrbit[2]]}
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      {active && (
        <Html position={[positionOnOrbit[0], positionOnOrbit[1] + size + 1, positionOnOrbit[2]]}>
          <div style={{ 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            width: '200px' 
          }}>
            <h3>{name}</h3>
            <p>{facts}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function SolarSystem() {
  const planets = [
    { name: "Mercury", color: "#FFD700", size: 0.4, orbitRadius: 10, orbitSpeed: 0.01, rotationSpeed: 0.005, facts: "Mercury is the smallest planet in our Solar System and the closest to the Sun." },
    { name: "Venus", color: "#FFA500", size: 0.9, orbitRadius: 15, orbitSpeed: 0.007, rotationSpeed: 0.002, facts: "Venus is often called Earth's twin because of their similar size, mass, and proximity to the Sun." },
    { name: "Earth", color: "#00BFFF", size: 1, orbitRadius: 20, orbitSpeed: 0.005, rotationSpeed: 0.02, facts: "Earth is the only planet known to harbor life and has a unique atmosphere composed mostly of nitrogen and oxygen." },
    { name: "Mars", color: "#FF4500", size: 0.5, orbitRadius: 25, orbitSpeed: 0.003, rotationSpeed: 0.018, facts: "Mars is known as the Red Planet due to its reddish appearance, caused by iron oxide on its surface." },
    { name: "Jupiter", color: "#DEB887", size: 2.2, orbitRadius: 35, orbitSpeed: 0.002, rotationSpeed: 0.04, facts: "Jupiter is the largest planet in our Solar System and has a Great Red Spot, a giant storm that has lasted for hundreds of years." },
    { name: "Saturn", color: "#F4A460", size: 2, orbitRadius: 45, orbitSpeed: 0.0009, rotationSpeed: 0.038, facts: "Saturn is known for its prominent ring system, composed mainly of ice particles with a smaller amount of rocky debris and dust." },
    { name: "Uranus", color: "#40E0D0", size: 1.6, orbitRadius: 55, orbitSpeed: 0.0004, rotationSpeed: 0.03, facts: "Uranus is tilted on its side, causing extreme seasonal variations. It also has a blue-green color due to methane in its atmosphere." },
    { name: "Neptune", color: "#4169E1", size: 1.5, orbitRadius: 65, orbitSpeed: 0.0001, rotationSpeed: 0.032, facts: "Neptune has the strongest winds in the Solar System, with speeds reaching up to 2,100 km/h (1,300 mph)." },
  ]

  return (
    <Canvas camera={{ position: [0, 30, 100], fov: 60 }}>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={1.5} />
      
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>
      
      {planets.map((planet, index) => (
        <Planet key={index} {...planet} />
      ))}
      
      <Sparkles count={10000} scale={300} size={1} speed={0.3} />
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <SolarSystem />
    </div>
  )
}

export default App