import { useState } from 'react';

export default function ErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error from button');
  }

  return (
    <button className="error-button" onClick={() => setShouldThrow(true)}>
      Error button
    </button>
  );
}
