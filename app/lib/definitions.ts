// This file contains type definitions for the application

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type GridType = {
  id: number;
  Quantity: number;
  buyPrice: number;
  capital: number;
  sellPrice: number;
  earn: number;
  status: boolean;
};

export type StockData = {
  time: string,
  value: number
}

export interface FlagSectionData {
  buyOnGrid: boolean;
  sellOnGrid: boolean;
  commissionPercentage: string;
  fixedCommission: string;
}