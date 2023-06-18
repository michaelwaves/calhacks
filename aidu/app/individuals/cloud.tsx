import { Cloud, OrbitControls } from "@react-three/drei/core";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

import MyCloud from "@/public/Cloud";

export default function CloudComponent() {
    return (
        <div className="w-screen h-[50vh]">
            <Canvas>
                <OrbitControls />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                    <Cloud></Cloud>
                    <MyCloud></MyCloud>
                </Suspense>
            </Canvas>
        </div>
    )
}