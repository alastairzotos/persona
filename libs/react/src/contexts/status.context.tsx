import React, { useEffect, useState } from "react";

type FetchStatus = 'fetching' | 'success' | 'error' | null;

interface StatusContextProps {
  status: FetchStatus;
  isFetching: boolean;
  errorMessage: string | null;
  setStatus: (status: FetchStatus, errorMessage?: string) => void;
}

const StatusContext = React.createContext<StatusContextProps>({
  status: null,
  errorMessage: null,
  isFetching: false,
  setStatus: () => {},
})

export const StatusProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<FetchStatus>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  return (
    <StatusContext.Provider
      value={{
        status,
        isFetching: status === "fetching",
        errorMessage,
        setStatus: (status, errorMessage) => {
          setStatus(status);
          setErrorMessage(errorMessage || null);
        }
      }}
    >
      {children}
    </StatusContext.Provider>
  )
}

export const useStatus = () => React.useContext(StatusContext);
