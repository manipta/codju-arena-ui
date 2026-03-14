import React from "react";
import CodeBlock from "./CodeBlock";

const CodeExample: React.FC = () => {
  const exampleCode = `const example = "Hello World";
console.log(example);

// Function example
function greet(name: string) {
  return \`Hello, \${name}!\`;
}

greet("Developer");`;

  const reactCode = `import React, { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Counter;`;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Code Examples</h2>

      <CodeBlock
        code={exampleCode}
        language="javascript"
        title="Basic JavaScript"
      />

      <CodeBlock code={reactCode} language="tsx" title="React Component" />
    </div>
  );
};

export default CodeExample;
