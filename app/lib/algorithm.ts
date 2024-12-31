import { GridType } from '@/app/lib/definitions';

interface Row {
    label: string;
    value: number;
  }

export  function GometricGrid(investment:number, Pa: number, Pb: number, P: number, n: number):GridType[] {

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
        return([]);
    }
  };

  export function GridBackTesting(grid: GridType[], csv: Row[] ):string[] {
    let gridprofit = 0;
    let saved = 0;
    let _grid = grid;
    let result = []

    csv.forEach((e) => {
        _grid = _grid.map((g) => {
            if (e.value < g.buyPrice && g.status == false) {
                result.push(`${e.label} buy at price ${e.value} grid n. ${g.id}`);
                saved += (g.buyPrice-e.value)*g.Quantity;
                return ({...g,status:true});
            } else {
                if (e.value > g.sellPrice && g.status == true) {
                    result.push(`${e.label} sell at price ${e.value} grid n. ${g.id}`)
                    gridprofit += g.earn;
                    return ({...g,status:false});
                } else {
                    return ({...g}); 
                }  
            }
        });
    });

    result.push(`----------------------------------`);
    result.push(`Total grid profit: ${gridprofit}`);
    result.push(`Total saved capital: ${saved}`);

    return(result);
  }