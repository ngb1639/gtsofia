const lines = [
  {
    type: "bus",
    number: "9",
    color: "#be1e2d",
    icon: "https://stolica.bg/svg/05-bus.svg",
    directionA: "Автобаза Искър",
    directionB: "ул. ген. Гурко",
    activeDirection: "A",
    stopsA: ["ул. ген. Гурко","СУ Св. Климент Охридски","Военна академия"],
    stopsB: ["Airport Terminal 2","Mladost 1"]
  },

  {
    type: "tram",
    number: "5",
    color: "#f6921e",
    icon: "https://stolica.bg/svg/02-tram.svg",
    directionA: "Court House",
    directionB: "Knyazhevo",
    activeDirection: "A",
    stopsA: ["Knyazhevo","NDK","Court House"],
    stopsB: ["Court House","NDK","Knyazhevo"]
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
    stopsA: ["Slivnitsa","Serdika","Airport"],
    stopsB: ["Airport","Serdika","Slivnitsa"]
  }
];
