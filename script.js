document.getElementById('calculate').addEventListener('click', function() {
    // Собираем цены ресурсов
    const ore = Number(document.getElementById('ore').value) || 0;
    const cloth = Number(document.getElementById('cloth').value) || 0;
    const wood = Number(document.getElementById('wood').value) || 0;
    const leather = Number(document.getElementById('leather').value) || 0;
    
    // Собираем настройки
    const cityBonus = Number(document.getElementById('city').value) || 0;
    const useFocus = document.getElementById('focus').checked;
    const stationFee = Number(document.getElementById('fee').value) || 0;
    const itemPrice = Number(document.getElementById('itemPrice').value) || 0;
    
    // Базовая стоимость ресурсов (пример — меч требует 16 руды + 8 дерева)
    let rawCost = (ore * 16) + (cloth * 0) + (wood * 8) + (leather * 0);
    
    // Возврат ресурсов от города
    let returnRate = cityBonus / 100;
    if (useFocus) returnRate += 0.30; // +30% с фокусом
    
    let actualCost = rawCost * (1 - returnRate);
    
    // Плата за станцию
    actualCost += itemPrice * (stationFee / 100);
    
    // Налог на продажу (3%)
    const sellTax = itemPrice * 0.03;
    
    // Чистая прибыль
    const netProfit = itemPrice - actualCost - sellTax;
    const margin = itemPrice > 0 ? (netProfit / itemPrice * 100) : 0;
    
    // Вывод результатов
    document.getElementById('results').style.display = 'flex';
    document.getElementById('costValue').textContent = Math.round(actualCost).toLocaleString() + ' ₴';
    
    const profitValue = document.getElementById('profitValue');
    profitValue.textContent = Math.round(netProfit).toLocaleString() + ' ₴';
    profitValue.className = 'value ' + (netProfit >= 0 ? 'profit-positive' : 'profit-negative');
    
    const marginValue = document.getElementById('marginValue');
    marginValue.textContent = margin.toFixed(1) + '%';
    marginValue.className = 'value ' + (margin >= 0 ? 'profit-positive' : 'profit-negative');
});
