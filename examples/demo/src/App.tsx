import { useKeyframes } from "dirigent";

function App() {
  return (
    <div>
      <p className="text-3xl font-bold underline">Hello, world!</p>
      <p className="text-grey-700">Value of a is: {typeof useKeyframes}</p>
    </div>
  );
}

export default App;
