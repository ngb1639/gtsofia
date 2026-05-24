const lines = [

  {
    type: "bus",
    number: "9",
    color: "#be1e2d",
    icon: "https://stolica.bg/svg/05-bus.svg",
    directionA: "Автобаза Искър",
    directionB: "ул. ген. Гурко",
    activeDirection: "A",
    stopsA: ["ул. ген. Гурко","СУ Св. Климент Охридски","Военна академия","129-то ОУ","ул. Черковна","ул. Оборище","ул. Калиманци","Румънско посолство","ул. Хемус","ул. Александър Жендов","ул. Николай Коперник","НУ за танцово изкуство","Автостанция Гео Милев","ж.к. Слатина","ВТУ Т. Каблешков","Слатина Булгарплод","БКС Средец","Автобаза Искър"],
    stopsB: ["Автобаза Искър","БКС Средец","Слатина Булгарплод","ВТУ Т. Каблешков","ж.к. Слатина","Автостанция Гео Милев","НУ за танцово изкуство","ул. Николай Коперник","ул. Александър Жендов","ул. Хемус","Румънско посолство","31-во СУЧЕМ","ул. Калиманци","ул. Оборище","ул. Черковна","129-то ОУ","Военна академия","пл. Орлов мост","ул. ген. Гурко"]
  },

  {
    type: "bus",
    number: "10",
    color: "#be1e2d",
    icon: "https://stolica.bg/svg/02-tram.svg",
    directionA: "Бусманци",
    directionB: "Димитър Миленков",
    activeDirection: "A",
    stopsA: ["кв. Димитър Миленков","Промишлена зона","Начало кв Д. Миленков","гара Искър","28-ми пощенски клон", "28-ми ДКЦ", "метростанция Искърско шосе","ж.к. Дружба 1","Разклона за летището","Технотест","ТЮФ","метростанция Софийска Света гора","ул. Подпор. Йордан Тодоров","ул. 5007","ул. Поручик Хр. Топракчиев","ул. 5010","Моста на р. Искър кв. Абдовица","Център кв. Абдовица","кв. Абдовица","Център кв. Абдовица","Трънска махала","Детски дом","кв. Бусманци"],
    stopsB: ["кв. Бусманци","Детски дом","Трънска махала","Моста на р. Искър кв. Абдовица","Център кв. Абдовица","кв. Абдовица","Център кв. Абдовица","ул. 5010","ул. Поручик Хр. Топракчиев","ул. 5007","метростанция Софийска Света гора","ул. Подпор. Йордан Тодоров","ТЮФ","Технотест","Разклона за летището","ж.к. Дружба 1","метростанция Искърско шосе","28-ми ДКЦ","28-ми пощенски клон","гара Искър","Начало кв Д. Миленков","Промишлена зона","кв. Димитър Миленков"]
  },

  {
    type: "trolley",
    number: "9",
    color: "#2aa9e0",
    icon: "https://stolica.bg/svg/04-trolley.svg",
    directionA: "Hadzhi Dimitar",
    directionB: "Borovo",
    activeDirection: "A",
    stopsA: ["Borovo","NDK","Sofia University","Hadzhi Dimitar"],
    stopsB: ["Hadzhi Dimitar","Sofia University","NDK","Borovo"]
  },

  {
    type: "night",
    number: "N4",
    color: "#000000",
    icon: "https://stolica.bg/svg/07-night-bus.svg",
    directionA: "Studentski Grad",
    directionB: "Obelya",
    activeDirection: "A",
    stopsA: ["Obelya","Lomsko Shose","Serdika","Studentski Grad"],
    stopsB: ["Studentski Grad","Serdika","Lomsko Shose","Obelya"]
  },

  {
    type: "metro",
    number: "1",
    color: "#ec2029",
    textColor: "white",
    icon: "https://stolica.bg/svg/01-metro.svg",
    directionA: "Airport",
    directionB: "Slivnitsa",
    activeDirection: "A",
    stopsA: ["Slivnitsa","Serdika","Sofia University","Mladost","Airport"],
    stopsB: ["Airport","Mladost","Sofia University","Serdika","Slivnitsa"]
  },

  {
    type: "metro",
    number: "2",
    color: "#1077bc",
    textColor: "white",
    icon: "https://stolica.bg/svg/01-metro.svg",
    directionA: "Vitosha",
    directionB: "Obelya",
    activeDirection: "A",
    stopsA: ["Obelya","Serdika","NDK","Vitosha"],
    stopsB: ["Vitosha","NDK","Serdika","Obelya"]
  },

  {
    type: "metro",
    number: "3",
    color: "#3bb44b",
    textColor: "white",
    icon: "https://stolica.bg/svg/01-metro.svg",
    directionA: "Hadzhi Dimitar",
    directionB: "Ovcha Kupel",
    activeDirection: "A",
    stopsA: ["Ovcha Kupel","Medical University","NDK","Hadzhi Dimitar"],
    stopsB: ["Hadzhi Dimitar","NDK","Medical University","Ovcha Kupel"]
  },

  {
    type: "metro",
    number: "4",
    color: "#fcd403",
    textColor: "black",
    icon: "https://stolica.bg/svg/01-metro.svg",
    directionA: "Business Park",
    directionB: "Airport",
    activeDirection: "A",
    stopsA: ["Airport","Mladost 1","Business Park"],
    stopsB: ["Business Park","Mladost 1","Airport"]
  }

];
