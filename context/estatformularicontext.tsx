import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FormStatusContextType {
  isFormCompleted: boolean;
  completeForm: () => void;
}

const FormStatusContext = createContext<FormStatusContextType | undefined>(undefined);

export const useFormStatus = () => {
  const context = useContext(FormStatusContext);
  if (context === undefined) {
    throw new Error('useFormStatus debe usarse dentro de un FormStatusProvider');
  }
  return context;
};

interface FormStatusProviderProps {
  children: ReactNode;
}

export const FormStatusProvider: React.FC<FormStatusProviderProps> = ({ children }) => {
  // estat inicial = false;
  const [isFormCompleted, setIsFormCompleted] = useState(false);

  // desbloquejar aplicació
  const completeForm = () => {
    setIsFormCompleted(true);
  };

  const value = {
    isFormCompleted,
    completeForm,
  };

  return (
    <FormStatusContext.Provider value={value}>
      {children}
    </FormStatusContext.Provider>
  );
};