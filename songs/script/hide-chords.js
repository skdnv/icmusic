// chords-toggle.js
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем стили для скрытия аккордов
    const style = document.createElement('style');
    style.textContent = `
        .chords-hidden .chord {
            display: none !important;
        }
        #toggle-chords.chords-hidden {
            background: #d4d4d4ff;
        }
        .toggle-chords-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `;
    document.head.appendChild(style);
    
    // Находим кнопку переключения аккордов
    const toggleButton = document.getElementById('toggle-chords');
    
    if (!toggleButton) {
        console.warn('Кнопка toggle-chords не найдена');
        return;
    }
    
    // SVG иконки
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    
    // Функция переключения аккордов
    function toggleChords() {
        const body = document.body;
        const chordsHidden = body.classList.contains('chords-hidden');
        
        if (chordsHidden) {
            // Показываем аккорды
            body.classList.remove('chords-hidden');
            toggleButton.classList.remove('chords-hidden');
            toggleButton.innerHTML = `<div class="toggle-chords-content">${eyeIcon} Аккорды</div>`;
            localStorage.setItem('chordsVisible', 'true');
        } else {
            // Скрываем аккорды
            body.classList.add('chords-hidden');
            toggleButton.classList.add('chords-hidden');
            toggleButton.innerHTML = `<div class="toggle-chords-content">${eyeOffIcon} Аккорды</div>`;
            localStorage.setItem('chordsVisible', 'false');
        }
    }
    
    // Обработчик клика по кнопке
    toggleButton.addEventListener('click', toggleChords);
    
    // Восстанавливаем состояние из localStorage
    const savedState = localStorage.getItem('chordsVisible');
    if (savedState === 'false') {
        document.body.classList.add('chords-hidden');
        toggleButton.classList.add('chords-hidden');
        toggleButton.innerHTML = `<div class="toggle-chords-content">${eyeOffIcon} Аккорды</div>`;
    } else {
        toggleButton.innerHTML = `<div class="toggle-chords-content">${eyeIcon} Аккорды</div>`;
    }
    
    // Горячая клавиша для переключения аккордов (Ctrl+H)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            toggleChords();
        }
    });
});