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
        return data.country_code; // Ej: "US", "GB", "ES"
    } catch (error) {
        console.warn('No se pudo detectar el país:', error);
        return null;
    }
}

// Obtiene tasas de cambio (gratis, 1500 req/mes)
async function getExchangeRates(targetCurrency = 'EUR') {
    try {
        // Si es EUR, no necesitamos conversión
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
    // 1. Precios en popup
    document.querySelectorAll('.popup-price-original').forEach(el => {
        const originalText = el.textContent;
        const eurAmount = parseFloat(originalText.replace(/[^\d.]/g, ''));
        const converted = convertPrice(eurAmount, rate, currency);
        el.textContent = `${converted.symbol}${converted.amount}`;
    });

    document.querySelectorAll('.popup-price-discount').forEach(el => {
        const originalText = el.textContent;
        const eurAmount = parseFloat(originalText.replace(/[^\d.]/g, ''));
        const converted = convertPrice(eurAmount, rate, currency);
        el.textContent = `${converted.symbol}${converted.amount}`;
    });

    // 2. Precios en carrusel (si los tienes)
    document.querySelectorAll('.book-price').forEach(el => {
        const eurAmount = parseFloat(el.dataset.price);
        const converted = convertPrice(eurAmount, rate, currency);
        el.textContent = `${converted.symbol}${converted.amount}`;
    });

    // 3. Mostrar indicador de moneda
    const indicator = document.getElementById('currency-indicator');
    if (indicator) {
        indicator.textContent = `Moneda: ${currencyConfig.name[currency] || 'EUR'}`;
        indicator.style.display = 'inline';
    }
}

// Inicializa el conversor al cargar la página
async function initCurrencyConverter() {
    // Detectar país
    const countryCode = await detectCountry();
    
    // Mapear país a moneda
    const countryToCurrency = {
        'US': 'USD',
        'GB': 'GBP',
        'JP': 'JPY',
        'CA': 'CAD',
        'AU': 'AUD',
        'MX': 'MXN',
        'BR': 'BRL',
        'CO': 'COP',
        'CL': 'CLP',
        'AR': 'ARS',
        'ES': 'EUR',
        'FR': 'EUR',
        'DE': 'EUR',
        'IT': 'EUR',
        // Añade más países según necesites
    };

    const targetCurrency = countryCode ? countryToCurrency[countryCode] : 'EUR';
    
    // Si es EUR, no hacemos nada
    if (targetCurrency === 'EUR') {
        console.log('Moneda base EUR, no se requiere conversión');
        return;
    }

    // Obtener tasa de cambio
    const rate = await getExchangeRates(targetCurrency);
    
    // Si conseguimos la tasa, actualizamos precios
    if (rate) {
        updateAllPrices(targetCurrency, rate);
        console.log(`Precios convertidos a ${targetCurrency} (tasa: ${rate})`);
    } else {
        console.log('Usando moneda base EUR');
    }
}

// ===================================
// DATOS DE LIBROS (tu código existente)
// ===================================
const libros = {
    '14-proyectos-diy': {
        titulo: '14 proyectos DIY para transformar tu hogar en un fin de semana',
        categoria: 'DIY',
        portada: 'https://i.ibb.co/Lh69XSpt/14-proyectos-DIY-para-transformar-tu-hogar-en-un-fin-de-semana.jpg',
        mock: 'https://i.ibb.co/DHMf47jK/14-Proyectos-DIY.png',
        descripcionCorta: 'Crea, decora y disfruta: 14 ideas paso a paso para renovar cualquier rincón sin obra ni gastos locos.',
        descripcionLarga: `...`,
        precioOriginal: 12.99,
        precioDescuento: 9.99,
        hotmartId: 'R102956683Y'
    },
    // ... resto de tus libros
};

// ===================================
// RESTO DE TU CÓDIGO EXISTENTE
// ===================================
function generarHotmartWidget(hotmartId) { /*...*/ }
function initHotmartInPopup() { /*...*/ }

// Header y menú
document.addEventListener('DOMContentLoaded', function() { /*...*/ });

// Carrusel
class Carousel { /*...*/ }

// Popup
function openPopup(bookId) { /*...*/ }
function closePopup() { /*...*/ }

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar conversor de moneda
    initCurrencyConverter();
    
    // Tu código existente...
    if (document.getElementById('diyCarousel')) {
        const librosDIY = ['14-proyectos-diy', 'diy-upcycling', 'velas-soja'];
        const librosSalud = ['auto-desempeno', 'madres-activas', 'operacion-verano'];
        const librosIA = ['ia-para-todos', 'estrategias-digitales'];

        new Carousel('diyCarousel', librosDIY);
        new Carousel('saludCarousel', librosSalud);
        new Carousel('iaCarousel', librosIA);
    }
    
    // ... resto de tu código
});

// Formulario contacto
function handleContactForm(e) { /*...*/ }
