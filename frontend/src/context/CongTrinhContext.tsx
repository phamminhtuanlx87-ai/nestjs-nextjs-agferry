import { ICongTrinh } from '@/services/congTrinhService';
import { createContext, useContext } from 'react';

const CongTrinhContext = createContext<ICongTrinh | undefined>(undefined);

export const CongTrinhProvider = ({ data, children }: { data: ICongTrinh, children: React.ReactNode }) => (
  <CongTrinhContext.Provider value={data}>
    {children}
  </CongTrinhContext.Provider>
);

export const useCongTrinh = () => useContext(CongTrinhContext);