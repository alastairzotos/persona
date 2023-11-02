import React from 'react';

export interface PersonaContextProps {
  apiUrl: string;
}

export const PersonaContext = React.createContext<PersonaContextProps>({
  apiUrl: '',
});

export const usePersona = () => React.useContext(PersonaContext);
