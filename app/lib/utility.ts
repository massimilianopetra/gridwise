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

import { cookies } from "next/headers";

export async function setToken(): Promise<string> {

    const sessionToken = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generate new token ${sessionToken}`);
    (await cookies()).set("token", sessionToken);
    return sessionToken;
}

export async function getToken(): Promise<string|undefined> {
    const  sessionToken = (await cookies()).get("token");
    console.log(`GeReaded token is ${sessionToken?.value}`);

    return sessionToken?.value;
}

// Funzione per convertire i dati in CSV con il separatore specificato
export function convertToCSV(data: any[], decimalSeparator: string): string {
  if (!data || data.length === 0) return '';

  // Ottieni le intestazioni
  const headers = Object.keys(data[0]).join(';');

  // Genera righe dei dati
  const rows = data.map(row => {
    return Object.values(row)
      .map(value => {
        if (typeof value === 'number') {
          // Sostituisci il punto o la virgola nei numeri
          return value.toString().replace('.', decimalSeparator);
        }
        // Gestisci stringhe che contengono virgole (le racchiudi tra virgolette)
        if (typeof value === 'string' && value.includes(';')) {
          return `"${value}"`;
        }
        return value;
      })
      .join(';');
  });

  // Unisci le righe con il separatore di riga
  return [headers, ...rows].join('\n');
};

export function parseCsv<T extends Record<string, any>>(
  fileContent: string,
  decimalSeparator: string,
  typeDef: T
): T[] {
  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    throw new Error("Invalid CSV: Missing header or data rows.");
  }

  // Leggi l'header dal CSV
  const header = lines[0].split(";").map((key) => key.trim());
  const keys = Object.keys(typeDef) as (keyof T)[];

  /* Controlla che l'header corrisponda ai campi del tipo
  if (header.length !== keys.length || !header.every((key) => keys.includes(key as keyof T))) {
    throw new Error(
      `Invalid CSV header: Expected ${keys.join(", ")}, but got ${header.join(", ")}.`
    );
  } */

  // Analizza le righe di dati
  return lines.slice(1).map((line, index) => {
    const values = line.split(";").map((value) => value.trim());

    if (values.length !== header.length) {
      throw new Error(
        `Invalid CSV format on line ${index + 2}: Expected ${header.length} columns, got ${values.length}.`
      );
    }

    const parsedObject = {} as T;

    header.forEach((key, i) => {
      const fieldType = typeof typeDef[key as keyof T];

      if (fieldType === "number") {
        // Converti i numeri gestendo il separatore decimale
        parsedObject[key as keyof T] = parseFloat(
          values[i].replace(decimalSeparator, ".")
        ) as T[keyof T];
      } else if (fieldType === "boolean") {
        // Converti i valori booleani
        parsedObject[key as keyof T] = (values[i].toLowerCase() === "true") as T[keyof T];
      } else {
        // Mantieni i valori stringa
        parsedObject[key as keyof T] = values[i] as T[keyof T];
      }
    });

    return parsedObject;
  });
}
