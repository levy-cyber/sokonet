import { createContext, useMemo, useState } from 'react';

export const AppContext = createContext({});

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState([
    { id: 1, title: 'Transaction updated', detail: 'Escrow payment released successfully.' },
    { id: 2, title: 'New marketplace seller', detail: 'A trusted vendor just joined SokoNet.' },
  ]);

  const value = useMemo(
    () => ({ sidebarOpen, setSidebarOpen, notifications }),
    [sidebarOpen, notifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
