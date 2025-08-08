// File: src/layout/UserLayout.js

import React from 'react';
import NavBarComponent from '@/components/navbar'; // ✅ Correct import

export default function UserLayout({ children }) {
  return (
    <div>
      <NavBarComponent />
      {children}
    </div>
  );
}
