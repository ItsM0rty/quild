import "./App.css";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Configurator from "./components/Configurator";
import { QuildConfigurationProvider } from "./contexts/QuildConfiguration";

function App() {
  return (
    <QuildConfigurationProvider>
      <div className="appShell">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [8, 4, 16], fov: 50, near: 0.1, far: 200 }}
        >
          <color attach="background" args={["#0f172a"]} />
          <fog attach="fog" args={["#0f172a", 18, 45]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[6, 12, 8]}
            intensity={0.8}
            castShadow={false}
          />
          <Experience />
        </Canvas>
        <Configurator />
      </div>
    </QuildConfigurationProvider>
  );
}

export default App;
