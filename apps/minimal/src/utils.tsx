import { Html } from "@react-three/drei";

// Simple full page loader, during scene setup
export const Loader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-1">
        <p className="text-neutral text-lg">Loading</p>
        <progress className="progress bg-neutral w-56 progress-primary shadow-md"></progress>
      </div>
    </Html>
  );
};
