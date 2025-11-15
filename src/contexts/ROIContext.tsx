import { createContext, useContext, useState, ReactNode } from "react";

interface ROIContextType {
  annualLoss: number;
  setAnnualLoss: (value: number) => void;
}

const ROIContext = createContext<ROIContextType | undefined>(undefined);

export const ROIProvider = ({ children }: { children: ReactNode }) => {
  const [annualLoss, setAnnualLoss] = useState(17000); // Default for small business

  return (
    <ROIContext.Provider value={{ annualLoss, setAnnualLoss }}>
      {children}
    </ROIContext.Provider>
  );
};

export const useROI = () => {
  const context = useContext(ROIContext);
  if (context === undefined) {
    throw new Error("useROI must be used within a ROIProvider");
  }
  return context;
};
