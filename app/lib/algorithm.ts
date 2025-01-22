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

import { GridType, StockData, FlagSectionData, StrategyResult } from '@/app/lib/definitions';

export function GometricGrid(investment: number, Pa: number, Pb: number, P: number, n: number, niteration: number,selPercentage: boolean, selInteger: boolean, aleady=0): GridType[] {

    console.log (selPercentage);

    if (selPercentage) {
        const percentage = 1+(n/100);
        n =  Math.floor(Math.log10(Pb/Pa)/Math.log10(percentage));
        console.log(n);
    }
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
                    local_result.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, effectiveBuyPrice: 0, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: false });
                } else {
                    local_result.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, effectiveBuyPrice: P, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: true });
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

        if (selInteger) {
            for (let i = 0; i < n; i++) {
                result[i] = { ...result[i],
                    Quantity: Math.trunc(result[i].Quantity), 
                    capital: Math.trunc(result[i].Quantity)*result[i].buyPrice, 
                    earn: Math.trunc(result[i].Quantity)*(result[i].sellPrice-result[i].buyPrice)}
            }
        }
        
        return (result);
    } else {
        return ([]);
    }
};

export function GetHoldQuantity(grid: GridType[], currentprice: number): number {
    let qty = 0;
    let initInvestent = 0;
    let saved = 0;
    let future = 0;

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

    return quota;
}

export function HoldStrategy(grid: GridType[], csv: StockData[]): StrategyResult {

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

    return {stockdata: h, summary: null};
}

export function GridStrategy(
    grid: GridType[],
    csv: StockData[],
    flags: FlagSectionData = {
        buyOnGrid: false,
        sellOnGrid: false,
        commissionPercentage: "0",
        fixedCommission: "0",
    }): StrategyResult {
    let gridprofit = 0;
    let _grid = grid;
    let totInvest = 0;
    let liquidity = 0;
    let profitableTrades = 0;

    const result = csv.map((e) => {
        _grid = _grid.map((g) => {
            if (e.value < g.buyPrice && g.status == false) {
                const price = flags.buyOnGrid ? g.buyPrice : e.value;
                const commision = Math.max(price*g.Quantity*parseFloat(flags.commissionPercentage)/100.0,parseFloat(flags.fixedCommission));
                gridprofit -= commision;
                return ({ ...g, effectiveBuyPrice: price, status: true });
            } else {
                if (e.value > g.sellPrice && g.status == true) {
                    const price = flags.sellOnGrid ? g.sellPrice : e.value;
                    profitableTrades += 1;
                    const commision = Math.max(price*g.Quantity*parseFloat(flags.commissionPercentage)/100.0,parseFloat(flags.fixedCommission));
                    console.log(`S BUY ${commision}`);
                    gridprofit += (price - g.effectiveBuyPrice) * g.Quantity - commision;
                    return ({ ...g, effectiveBuyPrice: 0, status: false });
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

        return ({ time: e.time, value: totInvest + liquidity + gridprofit});
    });

    console.log({profitableTrades: profitableTrades, gridProfit: gridprofit})
    return ({stockdata: result, summary: {profitableTrades: profitableTrades, gridProfit: gridprofit}});
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
    let _grid = grid;
    let lastPrice = 0
    let totInvest = 0;
    let liquidity = 0;
    let quantity = 0;
    let pcarico = 0;

    console.log("***************************************");
    console.log(parseFloat(flags.commissionPercentage));
    console.log(parseFloat(flags.fixedCommission));
    console.log("***************************************");

    _grid = _grid.map((g) => {
        if (g.status == false) {
            liquidity += g.Quantity * g.buyPrice;
        } else {
            quantity += g.Quantity;
            pcarico = g.effectiveBuyPrice;
        }
        return ({ ...g });
    })
    
    csv.forEach((e) => {
        lastPrice = e.value;
        _grid = _grid.map((g) => {
            if (e.value < g.buyPrice && g.status == false) {
                // Price below the grid, and grid not owned: must buy
                const price = flags.buyOnGrid ? g.buyPrice : e.value;
                const commision = Math.max(price*g.Quantity*parseFloat(flags.commissionPercentage)/100.0,parseFloat(flags.fixedCommission));
                gridprofit -= commision;
                liquidity -= price*g.Quantity;
                pcarico = (pcarico*quantity+price*g.Quantity)/(quantity+g.Quantity);
                quantity += g.Quantity;
                console.log(`${e.time} price=${e.value} liquidity=${liquidity} quantity=${quantity} pcarico=${pcarico} gprofit=${gridprofit} BUY at price ${price} grid n. ${g.id}`);
                return ({ ...g, effectiveBuyPrice: price, status: true });
            } else {
                const price = flags.sellOnGrid ? g.sellPrice : e.value;
                // Price above the grid, and grid owned: must sell
                if (e.value > g.sellPrice && g.status == true) {       
                    const commision = Math.max(price*g.Quantity*parseFloat(flags.commissionPercentage)/100.0,parseFloat(flags.fixedCommission));
                    gridprofit += (price - g.effectiveBuyPrice) * g.Quantity - commision;
                    liquidity += price*g.Quantity - commision;
                    quantity -= g.Quantity;
                    console.log(`${e.time} price=${e.value} liquidity=${liquidity} quantity=${quantity} pcarico=${pcarico} gprofit=${gridprofit} SELL at price ${price} grid n. ${g.id}`);
                    return ({ ...g, effectiveBuyPrice:0, status: false });
                } else {
                    console.log(`${e.time} price=${e.value} liquidity=${liquidity} quantity=${quantity} pcarico=${pcarico} gprofit=${gridprofit} NOTHING for grid n. ${g.id}`);
                    return ({ ...g });
                }
            }

        });
    });


    return ([]);
}