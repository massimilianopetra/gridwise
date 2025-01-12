 // Funzione per convertire i dati in CSV con il separatore specificato
 export function  convertToCSV (data: any[], decimalSeparator: string): string {
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