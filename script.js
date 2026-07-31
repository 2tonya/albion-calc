document.getElementById('calculate').addEventListener('click', function() {
    // Собираем цены ресурсов
    const orePrice = Number(document.getElementById('ore').value) || 0;
    const clothPrice = Number(document.getElementById('cloth').value) || 0;
    const woodPrice = Number(document.getElementById('wood').value) || 0;
    const leatherPrice = Number(document.getElementById('leather').value) || 0;
    
    // Рецепт: 16 руды + 8 дерева (пример — меч T4)
    const oreQty = 16;
    const clothQty = 0;
    const woodQty = 8;
    const leatherQty = 0;
    
    // Стоимость всех материалов
    const materialsCost = (orePrice * oreQty) + (clothPrice * clothQty) + 
                          (woodPrice * woodQty) + (leatherPrice * leatherQty);
    
    // RRR (возврат ресурсов)
    const cityBonus = Number(document.getElementById('city').value) || 0;
    const useFocus = document.getElementById('focus').checked;
    let rrr = cityBonus / 100;
    if (useFocus) rrr += 0.30; // +30% с фокусом
    
    // Стоимость материалов с учётом возврата
    const materialsAfterRRR = materialsCost * (1 - rrr);
    
    // Плата за станцию (формула из гайда)
    const stationTax = Number(document.getElementById('fee').value) || 0;
    const itemValue = 54; // Базовая стоимость предмета (нужно брать из API/справочника)
    const stationFee = itemValue * (stationTax / 100) * 0.001125;
    
    // Рыночная цена предмета
    const itemPrice = Number(document.getElementById('itemPrice').value) || 0;
    
    // Налог на продажу (3%)
    const sellTax = itemPrice * 0.03;
    
    // Итоговая себестоимость
    const totalCost = materialsAfterRRR + stationFee;
    
    // Чистая прибыль
    const netProfit = itemPrice - totalCost - sellTax;
    const margin = itemPrice > 0 ? (netProfit / itemPrice * 100) : 0;
    
    // Вывод
    document.getElementById('results').style.display = 'flex';
    document.getElementById('costValue').textContent = Math.round(totalCost).toLocaleString() + ' ₴';
    
    const profitEl = document.getElementById('profitValue');
    profitEl.textContent = Math.round(netProfit).toLocaleString() + ' ₴';
    profitEl.className = 'value ' + (netProfit >= 0 ? 'profit-positive' : 'profit-negative');
    
    const marginEl = document.getElementById('marginValue');
    marginEl.textContent = margin.toFixed(1) + '%';
    marginEl.className = 'value ' + (margin >= 0 ? 'profit-positive' : 'profit-negative');
});
