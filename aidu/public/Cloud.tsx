/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 cloud.gltf
*/
import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export default function MyCloud(props: any) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/cloud.gltf')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    actions['idle']?.play()
    actions['idle.001']?.play()
    actions['idle.002']?.play()
    actions["blink"]?.play()
    actions["blink"]?.play()
    actions["eyes.002Action"]?.play()
  }, [actions])
  return (
    <group ref={group} {...props} dispose={null} >
      <group name="Scene" rotation={[0, 3.14, 0]}>
        <mesh name="Cube" geometry={nodes.Cube.geometry} material={materials.primary_light} position={[0, 0.109, 0.058]} scale={[1, 1.205, 1]}>
          <mesh name="Cube004" geometry={nodes.Cube004.geometry} material={materials.black} position={[-0.019, -0.16, -0.205]} rotation={[0, 0, Math.PI]} scale={[0.184, 0.048, 0.383]} />
          <mesh name="Cylinder" geometry={nodes.Cylinder.geometry} material={materials.primary_light} position={[1.05, -0.15, -0.039]} rotation={[Math.PI / 2, 0, 0]} scale={[0.686, 0.266, 0.569]} />
          <mesh name="Cylinder002" geometry={nodes.Cylinder002.geometry} material={materials.primary_light} position={[-1.087, -0.122, -0.002]} rotation={[Math.PI / 2, 0, 0]} scale={[0.766, 0.297, 0.635]} />
          <mesh name="eyes" geometry={nodes.eyes.geometry} material={materials.black} position={[-0.39, 0.147, -0.223]} scale={[0.178, 0.171, 0.37]} />
          <mesh name="eyes002" geometry={nodes.eyes002.geometry} material={materials.black} position={[0.298, 0.139, -0.223]} scale={[0.178, 0.171, 0.37]} />
          <mesh name="Cylinder001" geometry={nodes.Cylinder001.geometry} material={materials.primary_light} position={[-1.641, -0.33, -0.07]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={[-0.42, -0.202, -0.348]} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/cloud.gltf')
