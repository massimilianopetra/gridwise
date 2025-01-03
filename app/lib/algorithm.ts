import { GridType, StockData } from '@/app/lib/definitions';

export function GometricGrid(investment: number, Pa: number, Pb: number, P: number, n: number): GridType[] {

    const grid_gain = (Pb / Pa) ** (1 / n);
    var result: GridType[] = [];

    // Controllo congruenza parametri
    if (Pa > 0 && Pb > 0 && investment > 0 && n > 2 && P > 0 && Pb > Pa) {

        for (let i = 0; i < n; i++) {

            const priceBuy = Pa * (grid_gain ** i);
            const priceSell = Pa * (grid_gain ** (i + 1));
            const qty = (investment / n) / priceBuy
            const earn = qty * (priceSell - priceBuy);
            if (P > priceBuy) {
                result.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: false });
            } else {
                result.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: true });
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

    const quota = (initInvestent+future)/currentprice
    const h = csv.map(item => {
        return ({ ...item, value: item.value*quota});
    });

    return h;
}

export function GridStrategy(grid: GridType[], csv: StockData[]): StockData[] {
    let gridprofit = 0;
    let saved = 0;
    let _grid = grid;
    let totInvest = 0;
    let liquidity = 0;

    const result = csv.map((e) => {
        _grid = _grid.map((g) => {
            if (e.value < g.buyPrice && g.status == false) {
                saved += (g.buyPrice - e.value) * g.Quantity;
                return ({ ...g, status: true });
            } else {
                if (e.value > g.sellPrice && g.status == true) {
                    gridprofit += (e.value - g.buyPrice) * g.Quantity;
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

        return({time: e.time, value: totInvest+liquidity+gridprofit+saved});
    });

    return (result);
}

export function GridBackTesting(grid: GridType[], csv: StockData[]): string[] {
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
                result.push(`${e.time} buy at price ${e.value} grid n. ${g.id}`);
                saved += (g.buyPrice - e.value) * g.Quantity;
                return ({ ...g, status: true });
            } else {
                if (e.value > g.sellPrice && g.status == true) {
                    result.push(`${e.time} sell at price ${e.value} grid n. ${g.id}`)
                    gridprofit += (e.value - g.buyPrice) * g.Quantity;
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