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

import { GridType, StockData, FlagSectionData } from '@/app/lib/definitions';

export function GometricGrid(investment: number, Pa: number, Pb: number, P: number, n: number, niteration: number): GridType[] {

    const grid_gain = (Pb / Pa) ** (1 / n);
    var result: GridType[] = [];

    // Controllo congruenza parametri
    if (Pa > 0 && Pb > 0 && investment > 0 && n > 2 && P > 0 && Pb > Pa) {


        for (let iteration = 0; iteration < niteration; iteration++) {
            const local_result: GridType[] = [];
            var saved = 0;
            for (let i = 0; i < n; i++) {

                const priceBuy = Pa * (grid_gain ** i);
                const priceSell = Pa * (grid_gain ** (i + 1));
                const qty = (investment / n) / priceBuy
                const earn = qty * (priceSell - priceBuy);
                if (P > priceBuy) {
                    local_result.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: false });
                } else {
                    local_result.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: true });
                    saved += (priceBuy - P) * qty;
                }
            }
            investment = saved
            if (iteration == 0) {
                for (let i = 0; i < n; i++) {
                    result.push(local_result[i]);
                }
            } else {
                for (let i = 0; i < n; i++) {
                    result[i] = { ...result[i],
                        Quantity: result[i].Quantity+local_result[i].Quantity, 
                        capital: result[i].capital+local_result[i].capital, 
                        earn:result[i].earn+local_result[i].earn  }
                }
            }
        }
        return (result);
    } else {
        return ([]);
    }
};

export function HoldStrategy(grid: GridType[], csv: StockData[]): StockData[] {

    let qty = 0;
    let initInvestent = 0;
    let saved = 0;
    let future = 0;
    const currentprice = csv[0].value;

    grid.forEach((item) => {
        if (currentprice < item.buyPrice) {
            qty += item.Quantity
            initInvestent += item.Quantity * currentprice;
            saved += item.Quantity * (item.buyPrice - currentprice)

        } else {
            future += item.Quantity * item.buyPrice;
        }
    });

    const quota = (initInvestent + future) / currentprice
    const h = csv.map(item => {
        return ({ ...item, value: item.value * quota });
    });

    return h;
}

export function GridStrategy(
    grid: GridType[],
    csv: StockData[],
    flags: FlagSectionData = {
        buyOnGrid: false,
        sellOnGrid: false,
        commissionPercentage: "0",
        fixedCommission: "0",
    }): StockData[] {
    let gridprofit = 0;
    let saved = 0;
    let _grid = grid;
    let totInvest = 0;
    let liquidity = 0;

    const result = csv.map((e) => {
        _grid = _grid.map((g) => {
            if (e.value < g.buyPrice && g.status == false) {
                const price = flags.buyOnGrid ? g.buyPrice : e.value;
                saved += (g.buyPrice - price) * g.Quantity;
                return ({ ...g, status: true });
            } else {
                if (e.value > g.sellPrice && g.status == true) {
                    const price = flags.sellOnGrid ? g.sellPrice : e.value;
                    gridprofit += (price - g.buyPrice) * g.Quantity;
                    return ({ ...g, status: false });
                } else {
                    return ({ ...g });
                }
            }
        });

        totInvest = 0;
        liquidity = 0;
        _grid.forEach((g) => {
            if (g.status == true) {

                totInvest += g.Quantity * e.value;
            } else {
                liquidity += g.Quantity * g.buyPrice;
            }

        });

        return ({ time: e.time, value: totInvest + liquidity + gridprofit + saved });
    });

    return (result);
}

export function GridBackTesting(
    grid: GridType[],
    csv: StockData[],
    flags: FlagSectionData = {
        buyOnGrid: false,
        sellOnGrid: false,
        commissionPercentage: "0",
        fixedCommission: "0",
    }): string[] {
    let gridprofit = 0;
    let saved = 0;
    let _grid = grid;
    let result = []
    let lastPrice = 0
    let totInvest = 0;
    let liquidity = 0;

    csv.forEach((e) => {
        lastPrice = e.value;
        _grid = _grid.map((g) => {
            if (e.value < g.buyPrice && g.status == false) {
                const price = flags.buyOnGrid ? g.buyPrice : e.value;
                result.push(`${e.time} buy at price ${price} grid n. ${g.id}`);
                saved += (g.buyPrice - price) * g.Quantity;
                return ({ ...g, status: true });
            } else {
                const price = flags.sellOnGrid ? g.sellPrice : e.value;
                if (e.value > g.sellPrice && g.status == true) {
                    result.push(`${e.time} sell at price ${price} grid n. ${g.id}`)
                    gridprofit += (price - g.buyPrice) * g.Quantity;
                    return ({ ...g, status: false });
                } else {
                    return ({ ...g });
                }
            }
        });
    });

    result.push(`----------------------------------`);
    result.push(`Total grid profit: ${gridprofit.toFixed(2)}`);
    result.push(`Total saved capital: ${saved.toFixed(2)}`);

    _grid = _grid.map((g) => {
        if (g.status == true) {

            totInvest += g.Quantity * lastPrice;
        } else {
            liquidity += g.Quantity * g.buyPrice;
        }

        return ({ ...g });
    });

    result.push(`Total allocated for next buy: ${liquidity.toFixed(2)}`);
    result.push(`Total invested capital: ${totInvest.toFixed(2)}`);
    return (result);
}