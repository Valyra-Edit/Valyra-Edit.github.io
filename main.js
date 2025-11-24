// ===================================
// CONVERSOR DE MONEDA AUTOMÁTICO
// ===================================
const currencyConfig = {
    default: 'EUR',
    symbol: {
        'EUR': '€',
        'USD': '$',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'CAD$',
        'AUD': 'AUD$',
        'MXN': '$',
        'BRL': 'R$',
        'COP': '$',
        'CLP': '$',
        'ARS': '$'
    },
    name: {
        'EUR': 'EUR',
        'USD': 'USD',
        'GBP': 'GBP',
        'JPY': 'JPY',
        'CAD': 'CAD',
        'AUD': 'AUD',
        'MXN': 'MXN',
        'BRL': 'BRL',
        'COP': 'COP',
        'CLP': 'CLP',
        'ARS': 'ARS'
    }
};

// Detecta el país por IP (gratis, sin API key)
async function detectCountry() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data.country_code;
    } catch (error) {
        console.warn('No se pudo detectar el país:', error);
        return null;
    }
}

// Obtiene tasas de cambio (gratis, 1500 req/mes)
async function getExchangeRates(targetCurrency = 'EUR') {
    try {
        if (targetCurrency === 'EUR') return null;
        
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/EUR`);
        const data = await response.json();
        return data.rates[targetCurrency];
    } catch (error) {
        console.warn('No se pudieron obtener tasas:', error);
        return null;
    }
}

// Convierte un precio de EUR a la moneda local
function convertPrice(eurPrice, rate, currency) {
    if (!rate) return {
        amount: eurPrice,
        symbol: currencyConfig.symbol[currency] || '€',
        code: currencyConfig.name[currency] || 'EUR'
    };
    
    const converted = (eurPrice * rate).toFixed(2);
    return {
        amount: converted,
        symbol: currencyConfig.symbol[currency] || '$',
        code: currencyConfig.name[currency] || currency
    };
}

// Actualiza todos los precios en la página
function updateAllPrices(currency, rate) {
    document.querySelectorAll('.popup-price-original').forEach(el => {
        const originalText = el.textContent;
        const eurAmount = parseFloat(originalText.replace(/[^\d.]/g, ''));
        if (!isNaN(eurAmount)) {
            const converted = convertPrice(eurAmount, rate, currency);
            el.textContent = `${converted.symbol}${converted.amount}`;
        }
    });

    document.querySelectorAll('.popup-price-discount').forEach(el => {
        const originalText = el.textContent;
        const eurAmount = parseFloat(originalText.replace(/[^\d.]/g, ''));
        if (!isNaN(eurAmount)) {
            const converted = convertPrice(eurAmount, rate, currency);
            el.textContent = `${converted.symbol}${converted.amount}`;
        }
    });

    const indicator = document.getElementById('currency-indicator');
    if (indicator) {
        indicator.textContent = `Moneda: ${currencyConfig.name[currency] || 'EUR'}`;
        indicator.style.display = 'inline';
    }
}

// Inicializa el conversor al cargar la página
async function initCurrencyConverter() {
    const countryCode = await detectCountry();
    
    const countryToCurrency = {
        'US': 'USD', 'GB': 'GBP', 'JP': 'JPY', 'CA': 'CAD', 'AU': 'AUD',
        'MX': 'MXN', 'BR': 'BRL', 'CO': 'COP', 'CL': 'CLP', 'AR': 'ARS',
        'ES': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'PT': 'EUR', 'NL': 'EUR'
    };

    const targetCurrency = countryCode ? countryToCurrency[countryCode] : 'EUR';
    
    if (targetCurrency === 'EUR') {
        console.log('Moneda base EUR, no se requiere conversión');
        return;
    }

    const rate = await getExchangeRates(targetCurrency);
    
    if (rate) {
        updateAllPrices(targetCurrency, rate);
        console.log(`Precios convertidos a ${targetCurrency} (tasa: ${rate})`);
    } else {
        console.log('Usando moneda base EUR');
    }
}

// ===================================
// DATOS DE LIBROS
// ===================================
const libros = {
    '14-proyectos-diy': {
        titulo: '14 proyectos DIY para transformar tu hogar en un fin de semana',
        categoria: 'DIY',
        portada: 'https://i.ibb.co/Lh69XSpt/14-proyectos-DIY-para-transformar-tu-hogar-en-un-fin-de-semana.jpg',
        mock: 'https://i.ibb.co/DHMf47jK/14-Proyectos-DIY.png',
        descripcionCorta: 'Crea, decora y disfruta: 14 ideas paso a paso para renovar cualquier rincón sin obra ni gastos locos.',
        descripcionLarga: `
            <p>Crea, decora y disfruta: 14 ideas paso a paso para renovar cualquier rincón sin obra ni gastos locos. 
            Con listas de materiales, trucos de experto y fotos detalladas, transformarás tu hogar en solo 48 horas 
            y con herramientas que ya tienes. ¡Manos a la obra!</p>
            <p>Ideal para personas que quieren darle un toque personal a su espacio sin invertir en reformas costosas. 
            Cada proyecto incluye instrucciones claras, tiempo estimado y presupuesto adecuado para cualquier bolsillo.</p>
        `,
        precioOriginal: 12.99,
        precioDescuento: 9.99,
        hotmartId: 'R102956683Y'
    },
    'auto-desempeno': {
        titulo: 'Auto Desempeño Masculino',
        categoria: 'Salud y Bienestar',
        portada: 'https://i.ibb.co/nsGjx7Ss/Auto-Desempe-o-Masculino.jpg',
        mock: 'https://i.ibb.co/hRVQ8Jn6/Auto-Desempe-o-Masculino.png',
        descripcionCorta: 'El enfoque real para durar más, disfrutar más y conectar de verdad.',
        descripcionLarga: `
            <p>El enfoque real para durar más, disfrutar más y conectar de verdad (sin trucos ni pastillas)</p>
            <p><strong>¿Ansiedad antes de una cita? ¿Miedo a no "rendir" lo suficiente? ¿Presión por ser siempre el que manda?</strong></p>
            <p>Este ebook no te promueve milagros: te da herramientas científicas y prácticas para controlar tu mente, 
            gestionar tu energía y disfrutar del momento íntimo y de la vida con confianza real.</p>
            <p><strong>Qué vas a lograr en 30 días:</strong></p>
            <ul style="color: var(--text-secondary); padding-left: 1.5rem;">
                <li>Controlar la ansiedad y el "ritmo" con técnicas de respiración validadas (4-7-8, coherente)</li>
                <li>Comunicar deseos y límites sin perder "masculinidad" (modelo CLEAR)</li>
                <li>Romper el ciclo de comparación y autocrítica con el método STOP</li>
                <li>Convertir tu cuerpo en aliado: alimentación, sueño y rutina de 20 min</li>
                <li>Construir relaciones más profundas y experiencias memorables</li>
            </ul>
        `,
        precioOriginal: 12.99,
        precioDescuento: 9.99,
        hotmartId: 'G102945033G'
    },
    'diy-upcycling': {
        titulo: 'DIY Upcycling 5 proyectos creativos para transformar tu hogar',
        categoria: 'DIY',
        portada: 'https://i.ibb.co/Kp5GtRJz/DIY-Upcycling-5-proyectos-creativos-para-transformar-tu-hogar.jpg',
        mock: 'https://i.ibb.co/1Y68N20F/DIY-Upcycling-5-proyectos-creativos-para-transformar-tu-hogar.png',
        descripcionCorta: 'Transforma tu hogar con 5 proyectos creativos usando materiales reciclados.',
        descripcionLarga: `
            <p>Imagina despertar el sábado, abrir un libro y el domingo tener tu casa renovada, más luminosa y llena de piezas que cuentan tu historia.</p>
            <p>Este ebook te guía paso a paso —con imágenes reales y materiales que ya tienes— para convertir camisetas viejas en bolsas, 
            frascos en organizadores, muebles olvidados en protagonistas y la luz más cálida que hayas encendido.</p>
            <p><strong>Sin máquina de coser, sin obra, sin gastar.</strong> Solo tijeras, pintura y la sensación de "lo hice yo" cada vez que alguien pregunte.</p>
            <p>Ideal para creativas que buscan desconectar del estrés, familias que quieren compartir un proyecto juntas y cualquier persona que quiera un hogar único sin ir al Ikea.</p>
            <p><strong>+Bonus:</strong> trucos para fotografiar tus creaciones y lucirlas en redes sin filtros.</p>
        `,
        precioOriginal: 12.99,
        precioDescuento: 9.99,
        hotmartId: 'W102956911G'
    },
    'estrategias-digitales': {
        titulo: 'Estrategias Digitales para PYMES en 2026',
        categoria: 'Finanzas e IA',
        portada: 'https://i.ibb.co/DPZQvtKX/Estrategias-Digitales-para-PYMES-en-2026.jpg',
        mock: 'https://i.ibb.co/h1XmWPrS/Estrategias-Digitales-para-PYMES-en-2026.png',
        descripcionCorta: 'Plan exprés para pasar del caos al crecimiento digital.',
        descripcionLarga: `
            <p>Plan exprés para pasar del caos al crecimiento: atención que vende, contenido que posiciona y una máquina de ventas que funciona mientras duermes.</p>
            <p>Incluye calendario 2026, flujos WhatsApp/Instagram listos para copiar-pegar, y el paso a paso para lanzar tu primer embudo en 7 días sin ser "influencer" ni invertir un euro en ads.</p>
            <p>Perfecto para emprendedores que quieren automatizar su negocio y escalar sin complicaciones tecnológicas.</p>
        `,
        precioOriginal: 19.99,
        precioDescuento: 14.99,
        hotmartId: 'H102956822M'
    },
    'ia-para-todos': {
        titulo: 'IA Para Todos',
        categoria: 'Finanzas e IA',
        portada: 'https://i.ibb.co/XZjfgM3n/IA-Para-Todos.jpg',
        mock: 'https://i.ibb.co/X1kMv7K/moc-ai-4.png',
        descripcionCorta: 'De 0 conocimientos a tus primeros ingresos con IA en 30 días.',
        descripcionLarga: `
            <p><strong>¿Tienes WhatsApp, Instagram y cuenta de banco? Entonces ya tienes TODO lo que necesitas para empezar a ganar dinero con Inteligencia Artificial.</strong></p>
            <p>IA para Todos es el único ebook en español que te lleva de 0 conocimientos a tus primeros ingresos reales en menos de 30 días, paso a paso, sin jerga técnica y sin comprar herramientas caras.</p>
            <p><strong>¿Qué lograrás con este ebook?</strong></p>
            <ul style="color: var(--text-secondary); padding-left: 1.5rem;">
                <li>Entender qué es la IA con analogías cotidianas (en 20 min)</li>
                <li>Crear 3 productos digitales vendibles este fin de semana (sin saber diseñar)</li>
                <li>Vender en Etsy, Wallapop o redes antes de que acabe el mes</li>
                <li>Montar mini-máquinas de ingresos pasivos que funcionen mientras duermes</li>
                <li>Escalar hasta 1.000 €/mes siguiendo un plan claro de 90 días</li>
            </ul>
        `,
        precioOriginal: 19.99,
        precioDescuento: 14.99,
        hotmartId: 'J102944384P'
    },
    'madres-activas': {
        titulo: 'Madres Activas en Casa',
        categoria: 'Salud y Bienestar',
        portada: 'https://i.ibb.co/KcVNTFn7/Madres-Activas-en-Casa.jpg',
        mock: 'https://i.ibb.co/zVbn5wn3/Madres-Activas-en-Casa.png',
        descripcionCorta: 'Bienestar real para mamás con rutinas flexibles y minutos al día.',
        descripcionLarga: `
            <p>Vuelve a sentirte bien contigo misma en solo minutos al día. Este ebook te acompaña con ejercicios suaves, mindfulness y rutinas flexibles que se adaptan a tu vida de mamá.</p>
            <p>Desde estiramientos de 7 minutos hasta mini rituales de gratitud que calman la mente y reconectan con tu cuerpo. <strong>Sin equipos, sin horarios imposibles, sin culpa.</strong></p>
            <p>Solo intención, amor propio y pasos pequeños que suman. Ideal para madres que buscan bienestar real, constancia amorosa y un rincón de calma dentro del caos diario.</p>
        `,
        precioOriginal: 12.99,
        precioDescuento: 9.99,
        hotmartId: 'S102968505K'
    },
    'operacion-verano': {
        titulo: 'Operacion Verano Guía Completa 2026',
        categoria: 'Salud y Bienestar',
        portada: 'https://i.ibb.co/d0YRz67G/Gu-a-Completa-2026.jpg',
        mock: 'https://i.ibb.co/2Y89rZx5/Operaci-n-Verano.png',
        descripcionCorta: '12 semanas para tu mejor verano sin pasar hambre ni cardio excesivo.',
        descripcionLarga: `
            <p>Plan completo de 12 semanas para bajar grasa, ganar músculo y lucir el cuerpo que deseas sin pasar hambre, sin cardio excesivo y sin suplementos milagro.</p>
            <p><strong>Incluye:</strong></p>
            <ul style="color: var(--text-secondary); padding-left: 1.5rem;">
                <li>Rutinas por nivel (principiante → avanzado) con solo 8 ejercicios clave</li>
                <li>Calculadora personal de calorías + menús semanales reales</li>
                <li>Cardio inteligente (LISS/HIIT) en 20-30 min</li>
                <li>Desmontamos 10 mitos que te sabotean (ayunas, keto, "grasa localizada")</li>
                <li>Plantilla de seguimiento semanal para ajustar tu progreso</li>
            </ul>
            <p>Ideal si quieres resultados visibles antes de tus vacaciones y mantenerlos después.</p>
        `,
        precioOriginal: 12.99,
        precioDescuento: 9.99,
        hotmartId: 'O102968513I'
    },
    'velas-soja': {
        titulo: 'Velas de Soja Desde Cero',
        categoria: 'DIY',
        portada: 'https://i.ibb.co/MDvYmwgK/Velas-de-Soja-desde-cero.jpg',
        mock: 'https://i.ibb.co/8LCgzKfV/Velas-de-Soja.png',
        descripcionCorta: 'Crea velas naturales, regala luz y vende tu primer lote este mes.',
        descripcionLarga: `
            <p><strong>¿Te imaginas encender una vela hecha por ti, con tu aroma favorito, y sentir cómo el estrés se desvanece en segundos?</strong></p>
            <p>"Velas de Soja desde Cero" es mucho más que un libro de recetas: es tu guía paso a paso para crear velas naturales, regalar luz y, si lo deseas, vender tu primer lote este mismo mes sin invertir en equipos caros.</p>
            <p><strong>Lo que vas a lograr:</strong></p>
            <ul style="color: var(--text-secondary); padding-left: 1.5rem;">
                <li>Aprender la técnica exacta para velas limpias (sin humo negro ni tóxicos)</li>
                <li>Crear tu primera vela en 2 horas con ingredientes que encuentras en cualquier tienda</li>
                <li>Diseñar tu "firma aromática" personal</li>
                <li>Fotografiar y presentar tus creaciones como una marca premium</li>
                <li>Vender online: precios, empaques y textos que convierten</li>
            </ul>
        `,
        precioOriginal: 12.99,
        precioDescuento: 9.99,
        hotmartId: 'G102944748Y'
    }
};

// ===================================
// UTILIDADES
// ===================================
function generarHotmartWidget(hotmartId) {
    return `
        <script type="text/javascript">
            function importHotmart() { 
                var imported = document.createElement('script'); 
                imported.src = 'https://static.hotmart.com/checkout/widget.min.js'; 
                document.head.appendChild(imported); 
                var link = document.createElement('link'); 
                link.rel = 'stylesheet'; 
                link.type = 'text/css'; 
                link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css'; 
                document.head.appendChild(link);
            } 
            importHotmart(); 
        <\/script>
        <a onclick="return false;" href="https://pay.hotmart.com/${hotmartId}?checkoutMode=2" class="hotmart-fb hotmart__button-checkout">
            <img src="https://static.hotmart.com/img/btn-buy-green.png" alt="Comprar ahora">
        </a>
    `;
}

function initHotmartInPopup() {
    if (window.Hotmart) return;
    
    const script = document.createElement('script');
    script.src = 'https://static.hotmart.com/checkout/widget.min.js';
    script.onload = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
        document.head.appendChild(link);
    };
    document.head.appendChild(script);
}

// ===================================
// HEADER Y MENÚ DESPLEGABLE
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    
    dropdown.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            this.classList.toggle('active');
        }
    });

    const dropdownSections = document.querySelectorAll('.dropdown-section');
    
    dropdownSections.forEach(section => {
        section.addEventListener('click', function(e) {
            e.stopPropagation();
            
            dropdownSections.forEach(otherSection => {
                if (otherSection !== this) {
                    otherSection.querySelector('.submenu-books').classList.remove('active');
                }
            });
            
            const submenu = this.querySelector('.submenu-books');
            submenu.classList.toggle('active');
        });
    });

    document.addEventListener('click', function() {
        dropdown.classList.remove('active');
        document.querySelectorAll('.submenu-books').forEach(submenu => {
            submenu.classList.remove('active');
        });
    });
});

// ===================================
// CARRUSEL
// ===================================
class Carousel {
    constructor(containerId, books) {
        this.container = document.getElementById(containerId);
        this.books = books;
        this.currentIndex = 0;
        this.track = this.container.querySelector('.carousel-track');
        this.nextBtn = this.container.querySelector('.carousel-btn.next');
        this.prevBtn = this.container.querySelector('.carousel-btn.prev');
        
        this.init();
    }

    init() {
        this.renderSlides();
        this.attachEvents();
        this.updateButtons();
    }

    renderSlides() {
        this.track.innerHTML = '';
        this.books.forEach(bookId => {
            const libro = libros[bookId];
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <img src="${libro.portada}" alt="${libro.titulo}">
                <h3 class="book-title">${libro.titulo}</h3>
                <p style="color: var(--text-secondary); text-align: center; margin-top: 0.5rem;">${libro.categoria}</p>
            `;
            slide.addEventListener('click', () => this.openPopup(bookId));
            this.track.appendChild(slide);
        });
    }

    attachEvents() {
        this.nextBtn.addEventListener('click', () => this.next());
        this.prevBtn.addEventListener('click', () => this.prev());
        
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        if (endX < startX - 50) this.next();
        if (endX > startX + 50) this.prev();
    }

    next() {
        if (this.currentIndex < this.books.length - 1) {
            this.currentIndex++;
            this.updatePosition();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updatePosition();
        }
    }

    updatePosition() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateButtons();
    }

    updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.books.length - 1;
    }

    openPopup(bookId) {
        openPopup(bookId);
    }
}

// ===================================
// POPUP CON HOTMART
// ===================================
function openPopup(bookId) {
    const libro = libros[bookId];
    if (!libro) return;

    const overlay = document.getElementById('popupOverlay');
    const content = document.getElementById('popupContent');
    
    content.innerHTML = `
        <div class="popup-header">
            <h2 class="popup-title">${libro.titulo}</h2>
            <button class="popup-close">&times;</button>
        </div>
        <div class="popup-body">
            <div>
                <img src="${libro.mock}" alt="${libro.titulo}" class="popup-image">
                <div class="popup-price-container">
                    <span class="popup-price-original" data-price="${libro.precioOriginal}">€${libro.precioOriginal.toFixed(2)}</span>
                    <span class="popup-price-discount" data-price="${libro.precioDescuento}">€${libro.precioDescuento.toFixed(2)}</span>
                </div>
                <div class="hotmart-container" id="hotmartContainer-${bookId}"></div>
            </div>
            <div>
                <h3 style="color: var(--primary-neon); margin-bottom: 1rem; font-family: var(--font-primary);">Descripción</h3>
                <div class="popup-description">${libro.descripcionLarga}</div>
                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(187,134,252,0.1); border-radius: 10px; border-left: 3px solid var(--secondary-neon);">
                    <p style="color: var(--secondary-neon); font-weight: 600;">🎯 ¡Aprovecha el 30% de descuento solo esta semana!</p>
                </div>
            </div>
        </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        initHotmartInPopup();
        const container = document.getElementById(`hotmartContainer-${bookId}`);
        if (container) {
            container.innerHTML = generarHotmartWidget(libro.hotmartId);
        }
    }, 100);

    const closeBtn = content.querySelector('.popup-close');
    closeBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closePopup();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
}

function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===================================
// INICIALIZACIÓN GENERAL
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar conversor de moneda
    initCurrencyConverter();
    
    // Inicializar carruseles si existen
    if (document.getElementById('diyCarousel')) {
        const librosDIY = ['14-proyectos-diy', 'diy-upcycling', 'velas-soja'];
        const librosSalud = ['auto-desempeno', 'madres-activas', 'operacion-verano'];
        const librosIA = ['ia-para-todos', 'estrategias-digitales'];

        new Carousel('diyCarousel', librosDIY);
        new Carousel('saludCarousel', librosSalud);
        new Carousel('iaCarousel', librosIA);
    }

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // EFECTO PARALLAX SOLO PARA DESKTOP (evita temblor en móviles)
    window.addEventListener('scroll', function() {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    });
});

// ===================================
// FORMULARIO CONTACTO
// ===================================
function handleContactForm(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    if (!email || !mensaje) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}
