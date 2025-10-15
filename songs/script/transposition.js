// Массивы аккордов по полутонам
const chordChart = [
    ['C', 'B#'], ['C#', 'Db'], ['D'], ['D#', 'Eb'], ['E', 'Fb'], ['F', 'E#'], 
    ['F#', 'Gb'], ['G'], ['G#', 'Ab'], ['A'], ['A#', 'Bb', 'B♭', 'H#'], ['B', 'Cb', 'H']
];

const minorChordChart = [
    ['Cm', 'B#m'], ['C#m', 'Dbm'], ['Dm'], ['D#m', 'Ebm'], ['Em', 'Fbm'], ['Fm', 'E#m'], 
    ['F#m', 'Gbm'], ['Gm'], ['G#m', 'Abm'], ['Am'], ['A#m', 'Bbm', 'H#m'], ['Bm', 'Cbm', 'Hm']
];

let currentTranspose = 0;
let originalChords = [];

// Функция для транспонирования аккорда
function transposeChord(chord, steps) {
    if (!chord || chord === 'N.C.' || chord === '-') return chord;
    
    // Проверяем сложные аккорды (типа G/B, C#sus4 и т.д.)
    if (chord.includes('/')) {
        const parts = chord.split('/');
        const baseChord = transposeChord(parts[0], steps);
        const bassNote = transposeChord(parts[1], steps);
        return baseChord + '/' + bassNote;
    }
    
    // Ищем аккорд в мажорной таблице
    for (let i = 0; i < chordChart.length; i++) {
        for (let variant of chordChart[i]) {
            // Проверяем точное совпадение или начало аккорда
            if (chord === variant || 
                chord.startsWith(variant + 'm') || 
                chord.startsWith(variant + '7') || 
                chord.startsWith(variant + '9') ||
                chord.startsWith(variant + 'sus') || 
                chord.startsWith(variant + 'add') ||
                chord.startsWith(variant + 'dim') || 
                chord.startsWith(variant + 'aug') ||
                chord.startsWith(variant + 'maj')) {
                
                let newIndex = (i + steps + chordChart.length) % chordChart.length;
                let newBase = chordChart[newIndex][0];
                
                // Для аккорда H меняем на B, но сохраняем суффикс
                let result = chord.replace(variant, newBase);
                
                // Если оригинальный аккорд был H, а замена на B, но пользователь привык к H,
                // можно оставить H, но лучше использовать международную систему
                return result;
            }
        }
    }
    
    // Ищем в минорной таблице
    for (let i = 0; i < minorChordChart.length; i++) {
        for (let variant of minorChordChart[i]) {
            if (chord === variant || chord.startsWith(variant)) {
                let newIndex = (i + steps + minorChordChart.length) % minorChordChart.length;
                let newBase = minorChordChart[newIndex][0];
                return chord.replace(variant, newBase);
            }
        }
    }
    
    // Специальная проверка для аккордов с H (немецкая система)
    if (chord.includes('H')) {
        // Заменяем H на B для обработки, а потом вернем обратно если нужно
        const tempChord = chord.replace(/H/g, 'B');
        const transposedTemp = transposeChord(tempChord, steps);
        // Можно вернуть обратно как H, но лучше оставить в международной системе
        return transposedTemp;
    }
    
    return chord; // Если не нашли, возвращаем оригинал
}

// Функция для сохранения оригинальных аккордов
function saveOriginalChords() {
    const chordElements = document.querySelectorAll('.chord');
    originalChords = [];
    chordElements.forEach(el => {
        originalChords.push(el.textContent);
    });
}

// Функция для транспонирования всех аккордов на странице
function transposeAllChords(steps) {
    // Сохраняем оригинальные аккорды при первом вызове
    if (originalChords.length === 0) {
        saveOriginalChords();
    }
    
    const chordElements = document.querySelectorAll('.chord');
    
    chordElements.forEach((el, index) => {
        const originalChord = originalChords[index];
        const newChord = transposeChord(originalChord, currentTranspose + steps);
        el.textContent = newChord;
    });
    
    currentTranspose += steps;
    updateDisplay();
}

// Функция сброса к оригинальной тональности
function resetToOriginal() {
    if (originalChords.length === 0) return;
    
    const chordElements = document.querySelectorAll('.chord');
    chordElements.forEach((el, index) => {
        el.textContent = originalChords[index];
    });
    
    currentTranspose = 0;
    updateDisplay();
}

// Функция обновления отображения текущей тональности
function updateDisplay() {
    const display = document.getElementById('current-key');
    if (!display) return;
    
    if (currentTranspose === 0) {
        display.textContent = '0';
    } else {
        const sign = currentTranspose > 0 ? '+' : '';
        display.textContent = `${sign}${currentTranspose}`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const btnUp = document.getElementById('transpose-up');
    const btnDown = document.getElementById('transpose-down');
    
    // Сохраняем оригинальные аккорды сразу при загрузке
    saveOriginalChords();
    
    if (btnUp) {
        btnUp.addEventListener('click', function() {
            transposeAllChords(1);
        });
    }
    
    if (btnDown) {
        btnDown.addEventListener('click', function() {
            transposeAllChords(-1);
        });
    }
    
    // Добавляем обработчик двойного клика для сброса
    const display = document.getElementById('current-key');
    if (display) {
        display.addEventListener('dblclick', resetToOriginal);
        display.title = 'Двойной клик для сброса к оригиналу';
    }
    
    updateDisplay();
});