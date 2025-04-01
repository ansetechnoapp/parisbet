'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [loading] = useState(false);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Loading: {loading.toString()}</p>
    </div>
  );
}
