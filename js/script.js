document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕКИ AOS АНИМАЦИЙ
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true });
    }

    // 2. БЫСТРАЯ ПРЕМИУМ-АНИМАЦИЯ НАПИСАНИЯ ТЕКСТА ЗАГОЛОВКА
    const titleContainer = document.getElementById('typing-title');
    const titleHTML = `Reklam artıq<br>sadəcə görünməməlidir.<br><span class="highlight">O, insanların<br>əlində olmalıdır.</span>`;
    
    let currentText = "";
    let isTag = false;
    let idx = 0;
    const speed = 25; // Скорость печати (очень шустрая, чтобы зацепить)

    function typeWriter() {
        if (idx < titleHTML.length) {
            let char = titleHTML.charAt(idx);
            
            if (char === '<') isTag = true;
            if (char === '>') { isTag = false; currentText += char; idx++; char = titleHTML.charAt(idx); }
            
            if (isTag) {
                currentText += char;
                idx++;
                typeWriter();
            } else {
                currentText += char;
                titleContainer.innerHTML = currentText + '<span class="typing-cursor"></span>';
                idx++;
                setTimeout(typeWriter, speed);
            }
        } else {
            // Удаляем мигающую каретку после завершения анимации
            const cursor = document.querySelector('.typing-cursor');
            if (cursor) cursor.remove();
        }
    }
    // Запуск пишущей машинки
    typeWriter();


    // 3. БЫСТРЫЙ СЧЕТЧИК ЦИФР ПРИ ДОСТИЖЕНИИ СКРОЛЛОМ (IntersectionObserver)
    const counters = document.querySelectorAll('.counter');
    
    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 1200; // Цифры набегают ровно за 1.2 сек
        const increment = target / (duration / 16); // Рассчет под 60fps кадров

        let currentNum = 0;
        const updateCount = () => {
            currentNum += increment;
            if (currentNum < target) {
                counter.innerText = Math.floor(currentNum);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    // Настройки триггера видимости экрана
    const observerOptions = {
        root: null,
        threshold: 0.2 // Срабатывает, когда сетка на 20% вошла в экран
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const blockCounters = entry.target.querySelectorAll('.counter');
                blockCounters.forEach(counter => startCounter(counter));
                
                // Прекращаем следить, чтобы цифры зафиксировались и не бегали заново при каждом скролле
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Вешаем слежку на блок статистики
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }


    // 4. ИНТЕРАКТИВНЫЙ ПАРАЛЛАКС НЕОНОВОГО БЭКГРАУНДА (Блик за бутылкой)
    const visualBlock = document.querySelector('.hero-visual-block');
    const glowBlur = document.getElementById('hero-glow');

    if (visualBlock && glowBlur) {
        visualBlock.addEventListener('mousemove', (e) => {
            const rect = visualBlock.getBoundingClientRect();
            
            // Вычисляем положение курсора относительно центра нашей интерактивной зоны
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Сдвигаем неоновый овал на 15% от амплитуды мыши
            const moveX = x * 0.15;
            const moveY = y * 0.15;

            glowBlur.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        // Мягкое возвращение неона в начальную точку, когда курсор уходит
        visualBlock.addEventListener('mouseleave', () => {
            glowBlur.style.transform = `translate(0px, 0px)`;
            glowBlur.style.transition = 'transform 0.5s ease-out';
        });
        
        // Убираем анимацию задержки при входе мыши для резкого нативного отклика
        visualBlock.addEventListener('mouseenter', () => {
            glowBlur.style.transition = 'none';
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {

    // ПЛАВНЫЙ СКРОЛЛ НАВБАРA
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3D ТИЛТ ЭФФЕКТ ДЛЯ СЦЕНЫ С ПОДИУМОМ
    const podiumScene = document.getElementById('podium-scene-box');
    const tiltWrapper = document.querySelector('.tilt-interactive-wrap');

    if (podiumScene && tiltWrapper) {
        podiumScene.addEventListener('mousemove', (e) => {
            const rect = podiumScene.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            const rotateX = -(y / (rect.height / 2)) * 12; 
            const rotateY = (x / (rect.width / 2)) * 14;   
            
            tiltWrapper.style.animation = 'none';
            tiltWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        podiumScene.addEventListener('mouseleave', () => {
            tiltWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
            tiltWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            setTimeout(() => {
                tiltWrapper.style.animation = 'levitateProduct 5s ease-in-out infinite';
            }, 600);
        });

        podiumScene.addEventListener('mouseenter', () => {
            tiltWrapper.style.transition = 'none';
        });
    }

    // ХОВЕР ЭФФЕКТЫ ДЛЯ СВЯЗУЮЩИХ ЛИНИЙ И ТОЧЕК
    const featureCards = document.querySelectorAll('.feature-row-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const index = card.getAttribute('data-index');
            const correspondingDot = document.querySelector(`.dot-${index}`);
            const correspondingLine = document.querySelector(`.line-${index}`);
            
            if (correspondingDot) {
                correspondingDot.style.transform = 'scale(2.5)';
                correspondingDot.style.backgroundColor = '#00a3ff';
                correspondingDot.style.boxShadow = '0 0 15px #00a3ff, 0 0 25px #0052ff';
            }
            if (correspondingLine) {
                correspondingLine.style.strokeWidth = '0.6';
                correspondingLine.style.stroke = '#00a3ff';
            }
        });

        card.addEventListener('mouseleave', () => {
            const index = card.getAttribute('data-index');
            const correspondingDot = document.querySelector(`.dot-${index}`);
            const correspondingLine = document.querySelector(`.line-${index}`);
            
            if (correspondingDot) {
                correspondingDot.style.transform = 'scale(1)';
                correspondingDot.style.backgroundColor = '#0052ff';
                correspondingDot.style.boxShadow = '0 0 10px #0052ff';
            }
            if (correspondingLine) {
                correspondingLine.style.strokeWidth = '0.3';
                correspondingLine.style.stroke = '#0052ff';
            }
        });
    });
});























document.addEventListener("DOMContentLoaded", () => {
    // 3D Tilt эффект для секции аналитики
    const analyticsScene = document.getElementById("analytics-scene-box");
    const analyticsTilt = document.getElementById("analytics-tilt-wrap");

    if (analyticsScene && analyticsTilt) {
        analyticsScene.addEventListener("mousemove", (e) => {
            const rect = analyticsScene.getBoundingClientRect();
            // Вычисляем позицию мыши относительно центра блока
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Базовый наклон (14deg) + реакция на курсор
            const rotateX = -(y / (rect.height / 2)) * 10; 
            const rotateY = 14 + (x / (rect.width / 2)) * 12;   
            
            analyticsTilt.style.animation = 'none'; // Отключаем левитацию во время ховера
            analyticsTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        analyticsScene.addEventListener("mouseleave", () => {
            // Возврат в начальное состояние
            analyticsTilt.style.transform = 'rotateX(0deg) rotateY(14deg) translateZ(0)';
            analyticsTilt.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            
            // Перезапуск анимации левитации
            setTimeout(() => {
                analyticsTilt.style.animation = 'levitateProduct 5s ease-in-out infinite';
            }, 600);
        });

        analyticsScene.addEventListener("mouseenter", () => {
            analyticsTilt.style.transition = 'none';
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. МОДУЛЬ АНИМАЦИИ ПРИ СКРОЛЛЕ (SCROLL REVEAL) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.12, // Анимация начнется, когда 12% элемента покажется во вьюпорте
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Отключаем слежку после активации, чтобы не дублировать анимацию
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- 2. ИНТЕРАКТИВНЫЙ ЭФФЕКТ 3D НАПРАВЛЕНИЯ КУРСОРA ---
    const analyticsScene = document.getElementById("analytics-scene-box");
    const analyticsTilt = document.getElementById("analytics-tilt-wrap");

    if (analyticsScene && analyticsTilt) {
        analyticsScene.addEventListener("mousemove", (e) => {
            const rect = analyticsScene.getBoundingClientRect();
            
            // Расчет позиции мыши относительно центра контейнера сцены
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Базовый наклон макета (14deg) + динамическое смещение по осям X и Y
            const rotateX = -(y / (rect.height / 2)) * 10; 
            const rotateY = 14 + (x / (rect.width / 2)) * 12;   
            
            analyticsTilt.style.animation = 'none'; // Останавливаем фоновую левитацию при взаимодействии
            analyticsTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        analyticsScene.addEventListener("mouseleave", () => {
            // Плавное возвращение к исходным 14 градусам
            analyticsTilt.style.transform = 'rotateX(0deg) rotateY(14deg) translateZ(0)';
            analyticsTilt.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            
            // Перезапуск мягкой левитации после ухода курсора
            setTimeout(() => {
                analyticsTilt.style.animation = 'levitateProduct 5s ease-in-out infinite';
            }, 600);
        });

        analyticsScene.addEventListener("mouseenter", () => {
            analyticsTilt.style.transition = 'none';
        });
    }
});










    // --- 1. МОДУЛЬ АНИМАЦИИ ПРИ СКРОЛЛЕ (SCROLL REVEAL) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.12, // Анимация начнется, когда 12% элемента покажется во вьюпорте
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Отключаем слежку после активации, чтобы не дублировать анимацию
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });







    