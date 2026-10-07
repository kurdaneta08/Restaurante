document.addEventListener('DOMContentLoaded', () => {
    const stages = [
        { title: 'Tu Selección', message: 'Revisa los detalles de tu orden antes de la preparación.', icon: '🍣' },
        { title: 'Preparando orden', message: 'Nuestros shokunin están enrollando tu pedido con arte.', icon: '✦' },
        { title: 'En ruta de entrega', message: 'El repartidor se dirige hacia tu ubicación en Chacao.', icon: '↗' },
        { title: 'Entregado con éxito', message: '¡Disfruta tu sushi! Gracias por elegirnos.', icon: '⌂' }
    ];

    const startButton = document.querySelector('#startButton');
    const resetButton = document.querySelector('#resetButton');
    const selectionSummary = document.querySelector('#selectionSummary');
    let countdown = document.querySelector('#countdown');
    const progressBar = document.querySelector('#progressBar');
    
    const stageIcon = document.querySelector('#stageIcon');
    const stageTitle = document.querySelector('#stageTitle');
    const stageMessage = document.querySelector('#stageMessage');
    const stepCards = [...document.querySelectorAll('.step-card')];

    let currentStage = 0;
    let timerId = null;

    function renderStage() {
        const stage = stages[currentStage];
        
        stageIcon.textContent = stage.icon;
        stageTitle.textContent = stage.title;
        stageMessage.textContent = stage.message;
        
        if (currentStage > 0) {
            selectionSummary.style.opacity = '0.5';
            selectionSummary.style.pointerEvents = 'none';
        } else {
            selectionSummary.style.opacity = '1';
            selectionSummary.style.pointerEvents = 'auto';
        }

        // Actualizar barra de progreso
        const progressPercentage = (currentStage / (stages.length - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Sincronizar tarjetas de pasos
        stepCards.forEach((card, index) => {
            card.classList.toggle('active', index === currentStage);
            card.classList.toggle('done', index < currentStage);
        });
    }

    function updateCountdown(seconds) {
        countdown = document.querySelector('#countdown');
        if (countdown) {
            countdown.textContent = String(seconds).padStart(2, '0');
        }
    }

    function runStage() {
        let seconds = 5;
        updateCountdown(seconds);
        
        timerId = setInterval(() => {
            seconds -= 1;
            updateCountdown(seconds);
            
            if (seconds === 0) {
                clearInterval(timerId);
                
                if (currentStage < stages.length - 1) {
                    currentStage += 1;
                    renderStage();
                    runStage();
                } else {
                    startButton.hidden = true;
                    resetButton.hidden = false;
                    document.querySelector('.timer-box').innerHTML = '<span class="timer-label">ESTADO</span><strong style="font-size:1.1rem; color:#f28ca8;">LISTO</strong><span class="timer-unit">ok</span>';
                }
            }
        }, 1000);
    }

    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        startButton.innerHTML = '<span>●</span> Procesando orden...';
        runStage();
    });

    resetButton.addEventListener('click', () => {
        if (timerId) clearInterval(timerId);
        
        currentStage = 0;
        renderStage();
        
        document.querySelector('.timer-box').innerHTML = `
            <span class="timer-label">TIEMPO</span>
            <strong id="countdown">05</strong>
            <span class="timer-unit">seg</span>
        `;
        countdown = document.querySelector('#countdown');
        
        startButton.hidden = false;
        startButton.disabled = false;
        startButton.innerHTML = '<span>▶</span> Iniciar Simulación de Pedido';
        resetButton.hidden = true;
    });

    renderStage();
});