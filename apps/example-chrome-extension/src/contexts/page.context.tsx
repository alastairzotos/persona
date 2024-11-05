import React, { useContext, useState, createContext } from "react";

export type PageUrl = 'home' | 'login' | 'register';

type PageContextProps = {
  page: PageUrl;
  setPage: (page: PageUrl) => void;
}

const PageContext = createContext<PageContextProps>({
  page: 'home',
  setPage: () => {},
});

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [page, setPage] = useState<PageUrl>('home');

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
}

export const usePage = () => useContext(PageContext);
