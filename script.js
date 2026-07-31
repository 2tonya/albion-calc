document.getElementById('calculate').addEventListener('click', function() {
    // Цены ресурсов (за штуку)
    const orePrice = Number(document.getElementById('ore').value) || 0;
    const clothPrice = Number(document.getElementById('cloth').value) || 0;
    const woodPrice = Number(document.getElementById('wood').value) || 0;
    const leatherPrice = Number(document.getElementById('leather').value) || 0;
    
    // Количество ресурсов в рецепте
    const oreQty = 16;
    const clothQty = 0;
    const woodQty = 8;
    const leatherQty = 0;
    
    // Полная стоимость материалов
    const totalMaterials = (orePrice * oreQty) + (clothPrice * clothQty) + 
                           (woodPrice * woodQty) + (leatherPrice * leatherQty);
    
    // RRR (возврат ресурсов)
    const cityRRR = Number(document.getElementById('city').value) || 0;
    const useFocus = document.getElementById('focus').checked;
    let rrrPercent = cityRRR;
    if (useFocus) rrrPercent += 30;
    const rrr = rrrPercent / 100;
    
    // Стоимость материалов после возврата
    const materialsAfterRRR = totalMaterials * (1 - rrr);
    
    // Плата за станцию: ItemValue × Tax × 0.001125
    const taxRate = Number(document.getElementById('taxRate').value) || 0;
    const itemValue = Number(document.getElementById('itemValue').value) || 0;
    const stationFee = itemValue * (taxRate / 100) * 0.001125;
    
    // Цена продажи
    const itemPrice = Number(document.getElementById('itemPrice').value) || 0;
    
    // Налог на продажу 3%
    const sellTax = itemPrice * 0.03;
    
    // Итого
    const totalCost = materialsAfterRRR + stationFee;
    const netProfit = itemPrice - totalCost - sellTax;
    const margin = itemPrice > 0 ? (netProfit / itemPrice * 100) : 0;
    
    // Вывод
    document.getElementById('results').style.display = 'flex';
    document.getElementById('materialsCost').textContent = Math.round(totalMaterials).toLocaleString() + ' ₴';
    document.getElementById('stationFeeDisplay').textContent = Math.round(stationFee).toLocaleString() + ' ₴';
    document.getElementById('costValue').textContent = Math.round(totalCost).toLocaleString() + ' ₴';
    
    const profitEl = document.getElementById('profitValue');
    profitEl.textContent = Math.round(netProfit).toLocaleString() + ' ₴';
    profitEl.className = 'value ' + (netProfit >= 0 ? 'profit-positive' : 'profit-negative');
    
    const marginEl = document.getElementById('marginValue');
    marginEl.textContent = margin.toFixed(1) + '%';
    marginEl.className = 'value ' + (margin >= 0 ? 'profit-positive' : 'profit-negative');
});
