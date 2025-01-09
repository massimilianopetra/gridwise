/*
 * This file is part of the project by Massimiliano Petra.
 *
 * Copyright (C) 2025 Massimiliano Petra
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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

export type StrategyResult = {
  stockdata: StockData[],
  summary: any
}

export interface FlagSectionData {
  buyOnGrid: boolean;
  sellOnGrid: boolean;
  commissionPercentage: string;
  fixedCommission: string;
}