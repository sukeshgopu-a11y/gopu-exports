"use client";
import { createContext, useContext } from "react";
import { COMPANY } from "@/lib/company";
const CompanyContext = createContext(COMPANY);
export const useCompany = () => useContext(CompanyContext);
export function CompanyProvider({ company, children }: { company: typeof COMPANY; children: React.ReactNode }) {
  return <CompanyContext.Provider value={company}>{children}</CompanyContext.Provider>;
}
