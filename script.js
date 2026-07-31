// ==================== БАЗА ДАННЫХ ПРЕДМЕТОВ ====================
const itemsDB = [
    {
        name: 'Меч T4',
        itemValue: 54,
        ore: 16,
        cloth: 0,
        wood: 8,
        leather: 0
    },
    {
        name: 'Шлем T4',
        itemValue: 48,
        ore: 8,
        cloth: 0,
        wood: 0,
        leather: 12
    },
    {
        name: 'Сапоги T4',
        itemValue: 42,
        ore: 0,
        cloth: 0,
        wood: 4,
        leather: 10
    },
    {
        name: 'Лук T4',
        itemValue: 60,
        ore: 0,
        cloth: 4,
        wood: 16,
        leather: 0
    },
    {
        name: 'Посох T4',
        itemValue: 66,
        ore: 8,
        cloth: 12,
        wood: 0,
        leather: 0
    }
];

// ==================== ЗАПОЛНЕНИЕ СПИСКА ПРЕДМЕТОВ ====================
const itemSelect = document.getElementById('itemSelect');
itemsDB.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = item.name;
    itemSelect.appendChild(option);
});

// ==================== ЭЛЕМЕНТЫ DOM ====================
const oreInput = document.getElementById('ore');
const clothInput = document.getElementById('cloth');
const woodInput = document.getElementById('wood');
const leatherInput = document.getElementById('leather');
const oreQty = document.getElementById('oreQty');
const clothQty = document.getElementById('clothQty');
const woodQty = document.getElementById('woodQty');
const leatherQty = document.getElementById('leatherQty');
const citySelect = document.getElementById('city');
const focusCheck = document.getElementById('focus');
const taxInput = document.getElementById('taxRate');
const itemValueInput = document.getElementById('itemValue');
const itemPriceInput = document.getElementById('itemPrice');

// ==================== ВЫБОР ПРЕДМЕТА ====================
itemSelect.addEventListener('change', function() {
    const index = this.value;
    if (index === '') {
        // Сброс
        oreQty.textContent = '×0';
        clothQty.textContent = '×0';
        woodQty.textContent = '×0';
        leatherQty.textContent = '×0';
        itemValueInput.value = '';
        return;
    }
    
    const item = itemsDB[index];
    itemValueInput.value = item.itemValue;
    oreQty.textContent = '×' + item.ore;
    clothQty.textContent = '×' + item.cloth;
    woodQty.textContent = '×' + item.wood;
    leatherQty.textContent = '×' + item.leather;
    
    calculate();
});

// ==================== АВТОПЕРЕСЧЁТ ====================
const allInputs = [oreInput, clothInput, woodInput, leatherInput, citySelect, focusCheck, taxInput, itemValueInput, itemPriceInput];

allInputs.forEach(input => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', calculate);
});

// ==================== ОСНОВНОЙ РАСЧЁТ ====================
function calculate() {
    // Сбор данных
    const orePrice = Math.max(0, Number(oreInput.value) || 0);
    const clothPrice = Math.max(0, Number(clothInput.value) || 0);
    const woodPrice = Math.max(0, Number(woodInput.value) || 0);
    const leatherPrice = Math.max(0, Number(leatherInput.value) || 0);
    
    const itemIndex = itemSelect.value;
    let recipe = { ore: 0, cloth: 0, wood: 0, leather: 0 };
    if (itemIndex !== '') {
        recipe = itemsDB[itemIndex];
    }
    
    // Стоимость материалов
    const materialsCost = (orePrice * recipe.ore) + (clothPrice * recipe.cloth) + 
                          (woodPrice * recipe.wood) + (leatherPrice * recipe.leather);
    
    // RRR
    const cityRRR = Number(citySelect.value) || 0;
    const useFocus = focusCheck.checked;
    let rrrPercent = cityRRR;
    if (useFocus) rrrPercent += 30;
    const rrr = rrrPercent / 100;
    
    const materialsAfterRRR = materialsCost * (1 - rrr);
    
    // Плата за станцию: ItemValue × Tax × 0.001125
    const taxRate = Math.max(0, Number(taxInput.value) || 0);
    const itemValue = Math.max(0, Number(itemValueInput.value) || 0);
    const stationFee = itemValue * (taxRate / 100) * 0.001125;
    
    // Цена продажи и налог
    const itemPrice = Math.max(0, Number(itemPriceInput.value) || 0);
    const sellTax = itemPrice * 0.03;
    
    // Итого
    const totalCost = materialsAfterRRR + stationFee;
    const netProfit = itemPrice - totalCost - sellTax;
    const margin = itemPrice > 0 ? (netProfit / itemPrice * 100) : 0;
    
    // Вывод результатов
    document.getElementById('materialsCost').textContent = Math.round(materialsCost).toLocaleString() + ' ₴';
    document.getElementById('stationFeeDisplay').textContent = Math.round(stationFee).toLocaleString() + ' ₴';
    document.getElementById('costValue').textContent = Math.round(totalCost).toLocaleString() + ' ₴';
    
    const profitEl = document.getElementById('profitValue');
    profitEl.textContent = Math.round(netProfit).toLocaleString() + ' ₴';
    profitEl.className = 'value ' + (netProfit >= 0 ? 'profit-positive' : 'profit-negative');
    
    const marginEl = document.getElementById('marginValue');
    marginEl.textContent = margin.toFixed(1) + '%';
    marginEl.className = 'value ' + (margin >= 0 ? 'profit-positive' : 'profit-negative');
    
    // Рекомендация M/C
    const recommendEl = document.getElementById('recommendValue');
    if (itemPrice === 0 && materialsCost === 0) {
        recommendEl.textContent = '—';
        recommendEl.className = 'value';
    } else if (netProfit > 0 && margin > 5) {
        recommendEl.textContent = '🟠 C (Крафт)';
        recommendEl.className = 'value profit-positive';
    } else {
        recommendEl.textContent = '🟢 M (Рынок)';
        recommendEl.className = 'value profit-negative';
    }
    
    // Детальная таблица
    updateDetailsTable(recipe, { ore: orePrice, cloth: clothPrice, wood: woodPrice, leather: leatherPrice }, rrr);
}

// ==================== ДЕТАЛЬНАЯ ТАБЛИЦА ====================
function updateDetailsTable(recipe, prices, rrr) {
    const tbody = document.getElementById('detailsBody');
    tbody.innerHTML = '';
    
    const resources = [
        { name: 'Руда', icon: '🪨', qty: recipe.ore, price: prices.ore },
        { name: 'Ткань', icon: '🧵', qty: recipe.cloth, price: prices.cloth },
        { name: 'Дерево', icon: '🪵', qty: recipe.wood, price: prices.wood },
        { name: 'Кожа', icon: '🦴', qty: recipe.leather, price: prices.leather }
    ];
    
    let anyData = false;
    
    resources.forEach(res => {
        if (res.qty === 0) return;
        anyData = true;
        
        const cost = res.qty * res.price;
        const returned = Math.floor(res.qty * rrr);
        const finalCost = (res.qty - returned) * res.price;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.icon} ${res.name}</td>
            <td>${res.qty}</td>
            <td>${res.price.toLocaleString()} ₴</td>
            <td>${Math.round(cost).toLocaleString()} ₴</td>
            <td>${returned} шт</td>
            <td>${Math.round(finalCost).toLocaleString()} ₴</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('detailsTable').style.display = anyData ? '' : 'none';
}

// ==================== КНОПКА "РАССЧИТАТЬ" ====================
document.getElementById('calculate').addEventListener('click', calculate);

// ==================== ОЧИСТИТЬ ВСЁ ====================
document.getElementById('clearAll').addEventListener('click', function() {
    oreInput.value = '';
    clothInput.value = '';
    woodInput.value = '';
    leatherInput.value = '';
    taxInput.value = '150';
    itemValueInput.value = '';
    itemPriceInput.value = '';
    focusCheck.checked = false;
    citySelect.value = '0';
    itemSelect.value = '';
    oreQty.textContent = '×0';
    clothQty.textContent = '×0';
    woodQty.textContent = '×0';
    leatherQty.textContent = '×0';
    
    document.getElementById('materialsCost').textContent = '—';
    document.getElementById('stationFeeDisplay').textContent = '—';
    document.getElementById('costValue').textContent = '—';
    document.getElementById('profitValue').textContent = '—';
    document.getElementById('profitValue').className = 'value';
    document.getElementById('marginValue').textContent = '—';
    document.getElementById('marginValue').className = 'value';
    document.getElementById('recommendValue').textContent = '—';
    document.getElementById('recommendValue').className = 'value';
    document.getElementById('detailsBody').innerHTML = '';
    document.getElementById('detailsTable').style.display = 'none';
});

// ==================== ИСТОРИЯ ====================
function getHistory() {
    const data = localStorage.getItem('albionCalcHistory');
    return data ? JSON.parse(data) : [];
}

function saveHistoryItem(entry) {
    const history = getHistory();
    history.unshift(entry);
    // Храним не больше 50 записей
    if (history.length > 50) history.pop();
    localStorage.setItem('albionCalcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = getHistory();
    const list = document.getElementById('historyList');
    
    if (history.length === 0) {
        list.innerHTML = '<p class="empty-history">Пока пусто. Сделайте расчёт и нажмите «Сохранить в историю».</p>';
        return;
    }
    
    list.innerHTML = history.map((entry, index) => {
        const profitClass = entry.netProfit >= 0 ? 'profit' : 'loss';
        const profitColor = entry.netProfit >= 0 ? 'profit-positive' : 'profit-negative';
        return `
            <div class="history-item ${profitClass}">
                <div class="history-info">
                    <div class="history-name">${entry.itemName}</div>
                    <div class="history-meta">${entry.date} | Себест: ${entry.totalCost}</div>
                </div>
                <div class="history-profit ${profitColor}">${entry.netProfit} | ${entry.margin}</div>
                <div class="history-actions">
                    <button onclick="loadHistoryItem(${index})">Загрузить</button>
                    <button class="btn-secondary" onclick="deleteHistoryItem(${index})">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
}

// Сохранить в историю
document.getElementById('saveHistory').addEventListener('click', function() {
    const itemIndex = itemSelect.value;
    if (itemIndex === '') {
        alert('Сначала выберите предмет и сделайте расчёт!');
        return;
    }
    
    const item = itemsDB[itemIndex];
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    const entry = {
        itemName: item.name,
        date: dateStr,
        totalCost: document.getElementById('costValue').textContent,
        netProfit: document.getElementById('profitValue').textContent,
        margin: document.getElementById('marginValue').textContent,
        // Сохраняем параметры для восстановления
        itemIndex: itemIndex,
        orePrice: oreInput.value,
        clothPrice: clothInput.value,
        woodPrice: woodInput.value,
        leatherPrice: leatherInput.value,
        city: citySelect.value,
        focus: focusCheck.checked,
        taxRate: taxInput.value,
        itemValue: itemValueInput.value,
        itemPrice: itemPriceInput.value
    };
    
    saveHistoryItem(entry);
});

// Загрузить из истории
function loadHistoryItem(index) {
    const history = getHistory();
    const entry = history[index];
    if (!entry) return;
    
    itemSelect.value = entry.itemIndex;
    oreInput.value = entry.orePrice;
    clothInput.value = entry.clothPrice;
    woodInput.value = entry.woodPrice;
    leatherInput.value = entry.leatherPrice;
    citySelect.value = entry.city;
    focusCheck.checked = entry.focus;
    taxInput.value = entry.taxRate;
    itemValueInput.value = entry.itemValue;
    itemPriceInput.value = entry.itemPrice;
    
    // Триггерим обновление количества ресурсов
    itemSelect.dispatchEvent(new Event('change'));
}

// Удалить одну запись
function deleteHistoryItem(index) {
    const history = getHistory();
    history.splice(index, 1);
    localStorage.setItem('albionCalcHistory', JSON.stringify(history));
    renderHistory();
}

// Очистить историю
document.getElementById('clearHistory').addEventListener('click', function() {
    if (confirm('Удалить всю историю расчётов?')) {
        localStorage.removeItem('albionCalcHistory');
        renderHistory();
    }
});

// ==================== БУРГЕР-МЕНЮ ====================
document.getElementById('burger').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open');
});

// Закрытие меню при клике на пункт (мобилки)
document.querySelectorAll('.menu-category, .menu-sub').forEach(item => {
    item.addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('open');
    });
});

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
renderHistory();
