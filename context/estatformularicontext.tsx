import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FormStatusContextType {
  isFormCompleted: boolean;
  completeForm: () => void;
  reportUpdateTrigger: number;
  triggerReportUpdate: () => void;
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
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [reportUpdateTrigger, setReportUpdateTrigger] = useState(0);

  const completeForm = () => {
    setIsFormCompleted(true);
  };
  
  const triggerReportUpdate = () => {
    setReportUpdateTrigger(prev => prev + 1);
  };

  const value = {
    isFormCompleted,
    completeForm,
    reportUpdateTrigger,
    triggerReportUpdate,
  };

  return (
    <FormStatusContext.Provider value={value}>
      {children}
    </FormStatusContext.Provider>
  );
};