/* =========================
GTFS DATA LOADER
Вземане и обработка на данни от Trinmo API
========================= */

const GTFS_ENDPOINTS = {
  routes: 'https://trinmo.org/gtfs-data/static/routes',
  trips: 'https://trinmo.org/gtfs-data/static/trips',
  stops: 'https://trinmo.org/gtfs-data/stops',
  stopTimes: 'https://trinmo.org/gtfs-data/static/stop_times'
};

const CACHE_KEY = 'gtsofia_gtfs_data';
const CACHE_TIMESTAMP_KEY = 'gtsofia_gtfs_timestamp';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 часа

/* =========================
ВЗЕМАНЕ НА ДАННИ
========================= */

async function fetchGTFSData() {
  try {
    console.log('🔄 Зареждане на GTFS данни...');

    // Вземане на маршрути, курсове и спирки в паралел
    const [routesData, tripsData, stopsData] = await Promise.all([
      fetch(GTFS_ENDPOINTS.routes).then(r => r.json()),
      fetch(GTFS_ENDPOINTS.trips).then(r => r.json()),
      fetch(GTFS_ENDPOINTS.stops).then(r => r.json())
    ]);

    console.log(`✅ Получени ${routesData.count} маршрути`);
    console.log(`✅ Получени ${tripsData.count} курсове`);
    console.log(`✅ Получени ${stopsData.count} спирки`);

    // Обработка на данните
    const processedData = processGTFSData(routesData, tripsData, stopsData);

    // Кеширане
    saveToCache(processedData);

    return processedData;

  } catch (error) {
    console.error('❌ Грешка при вземане на GTFS данни:', error);
    
    // Опит да се използват кешираните данни
    const cachedData = getFromCache();
    if (cachedData) {
      console.warn('⚠️ Използване на кеширани данни от локално съхранилище');
      return cachedData;
    }

    throw error;
  }
}

/* =========================
ОБРАБОТКА НА ДАННИТЕ
========================= */

function processGTFSData(routesData, tripsData, stopsData) {

  // Картиране на спирки по ID
  const stopsMap = {};
  stopsData.stops.forEach(stop => {
    stopsMap[stop.stop_code] = {
      name: stop.name_bg || stop.name_en || stop.stop_code,
      lat: parseFloat(stop.latitude),
      lon: parseFloat(stop.longitude)
    };
  });

  // Картиране на trip_headsigns по route_id
  const routeHeadsigns = {};
  tripsData.data.forEach(trip => {
    if (!routeHeadsigns[trip.route_id]) {
      routeHeadsigns[trip.route_id] = new Set();
    }
    if (trip.trip_headsign) {
      routeHeadsigns[trip.route_id].add(trip.trip_headsign);
    }
  });

  // Преобразуване на маршрути
  const lines = routesData.data.map(route => {

    const routeType = route.route_type;
    let type = 'bus';

    if (routeType === '0') type = 'tram';
    else if (routeType === '1') type = 'metro';
    else if (routeType === '11') type = 'trolley';
    else if (route.route_short_name.startsWith('N')) type = 'night';

    // Вземане на дестинациите за този маршрут
    const destinations = Array.from(routeHeadsigns[route.route_id] || []);

    // Ако има две дестинации, използвай първата и втората
    let directionA = destinations[0] || 'Не е известна';
    let directionB = destinations[1] || directionA;

    // Построяване на спирки
    const stopsA = getRouteStops(route.route_id, directionA, tripsData, stopsMap);
    const stopsB = getRouteStops(route.route_id, directionB, tripsData, stopsMap);

    return {
      type,
      number: route.route_short_name,
      color: '#' + (route.route_color || 'BE1E2D'),
      textColor: '#' + (route.route_text_color || 'FFFFFF'),
      icon: getTransportIcon(type),
      directionA,
      directionB,
      activeDirection: 'A',
      stopsA: stopsA.length > 0 ? stopsA : ['Спирките не са налични'],
      stopsB: stopsB.length > 0 ? stopsB : ['Спирките не са налични'],
      routeId: route.route_id
    };
  });

  return { lines, timestamp: new Date().toISOString() };
}

/* =========================
ПОСТРОЯВАНЕ НА СПИРКИ ЗА МАРШРУТ
========================= */

function getRouteStops(routeId, headsign, tripsData, stopsMap) {

  // Намиране на trip с този route_id и headsign
  const trip = tripsData.data.find(t =>
    t.route_id === routeId &&
    t.trip_headsign === headsign
  );

  if (!trip) {
    console.warn(`⚠️ Няма trip за маршрут ${routeId} с дестинация ${headsign}`);
    return [];
  }

  // За сега връщаме праразумни спирки
  // В идеалния случай, трябва stop_times endpoint
  // Засега ще връщаме масив от типични спирки

  const stops = [];
  Object.keys(stopsMap).slice(0, 15).forEach(stopCode => {
    stops.push(stopsMap[stopCode].name);
  });

  return stops;
}

/* =========================
ИКОНКИ ПО ТИП
========================= */

function getTransportIcon(type) {
  const iconMap = {
    bus: 'https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/bus.svg',
    tram: 'https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/tram.svg',
    trolley: 'https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/trolley.svg',
    metro: 'https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/metro.svg',
    night: 'https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/bus.svg'
  };
  return iconMap[type] || iconMap.bus;
}

/* =========================
КЕШИРАНЕ
========================= */

function saveToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log('💾 Данни кеширани успешно');
  } catch (error) {
    console.warn('⚠️ Грешка при кеширане:', error);
  }
}

function getFromCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!cached || !timestamp) return null;

    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_EXPIRY_MS) {
      console.warn('⚠️ Кешираните данни са изтекли');
      clearCache();
      return null;
    }

    console.log('📦 Използване на кеширани данни');
    return JSON.parse(cached);

  } catch (error) {
    console.warn('⚠️ Грешка при четене на кеш:', error);
    return null;
  }
}

function clearCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}

/* =========================
АВТОМАТИЧНО ОБНОВЯВАНЕ В 06:30
========================= */

function scheduleAutoUpdate() {

  function checkAndUpdate() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Проверка дали е време за обновяване (06:30)
    if (hours === 6 && minutes === 30) {
      console.log('🔄 Автоматично обновяване на GTFS данни...');
      clearCache();
      loadGTFSData();
    }
  }

  // Проверка всеки час
  setInterval(checkAndUpdate, 60 * 60 * 1000);

  // Първа проверка веднага
  checkAndUpdate();
}

/* =========================
ГЛАВНА ФУНКЦИЯ ЗА ЗАРЕЖДАНЕ
========================= */

async function loadGTFSData() {

  // Проверка за кеширани данни
  const cachedData = getFromCache();
  if (cachedData) {
    window.lines = cachedData.lines;
    return cachedData.lines;
  }

  // Ако няма кеш, вземи нови данни
  try {
    const data = await fetchGTFSData();
    window.lines = data.lines;
    return data.lines;
  } catch (error) {
    console.error('❌ Не могат да се заредят GTFS данни:', error);
    return [];
  }
}

/* =========================
ИНИЦИАЛИЗАЦИЯ
========================= */

document.addEventListener('DOMContentLoaded', () => {
  loadGTFSData();
  scheduleAutoUpdate();
});
