//https://demo-live-data.highcharts.com/aapl-c.json
//RGB
const mycolor = ["#CC0000", "#ffCC00", "#00CC00", "#0000CC"];

//2023.05.16   204148983 -> 204154601

//https://jarcom.top/g_tem.json
Highcharts.getJSON("./logsjson/204154601_tem.json", function (data) {
  // Create the chart
  //console.log(data);
  Highcharts.stockChart("containerT", {
    navigation: {
      bindingsClassName: "tools-container", // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
    },

    stockTools: {
      gui: {
        enabled: false, // disable the built-in toolbar
      },
    },

    series: [
      {
        id: "tem1",
        name: "TEM1",
        data: data[0],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[0],
      },
      {
        id: "tem2",
        name: "TEM2",
        data: data[1],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[1],
      },
      {
        id: "tem3",
        name: "TEM3",
        data: data[2],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[2],
      },
      {
        id: "tem3",
        name: "TEM3",
        data: data[3],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[3],
      },
    ],
  });
});

//https://jarcom.top/g_hum.json
Highcharts.getJSON("./logsjson/204154601_hum.json", function (data) {
  // Create the chart
  Highcharts.stockChart("containerH", {
    navigation: {
      bindingsClassName: "tools-container", // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
    },

    stockTools: {
      gui: {
        enabled: false, // disable the built-in toolbar
      },
    },

    series: [
      {
        id: "hum1",
        name: "HUM1",
        data: data[0],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[0],
      },
      {
        id: "hum2",
        name: "HUM2",
        data: data[1],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[1],
      },
      {
        id: "hum3",
        name: "HUM3",
        data: data[2],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[2],
      },
      {
        id: "hum4",
        name: "HUM4",
        data: data[3],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[3],
      },
    ],
  });
});

Highcharts.getJSON("./logsjson/204154601_rom.json", function (data) {
  // Create the chart
  Highcharts.stockChart("containerR", {
    navigation: {
      bindingsClassName: "tools-container", // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
    },

    stockTools: {
      gui: {
        enabled: false, // disable the built-in toolbar
      },
    },

    series: [
      {
        id: "rom1",
        name: "ROM1",
        data: data[0],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[0],
      },
      {
        id: "rom2",
        name: "ROM2",
        data: data[1],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[1],
      },
      {
        id: "rom3",
        name: "ROM3",
        data: data[2],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[2],
      },
      {
        id: "rom4",
        name: "ROM4",
        data: data[3],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[3],
      },
    ],
  });
});

Highcharts.getJSON("./logsjson/204154601_pas.json", function (data) {
  // Create the chart
  Highcharts.stockChart("containerP", {
    navigation: {
      bindingsClassName: "tools-container", // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
    },

    stockTools: {
      gui: {
        enabled: false, // disable the built-in toolbar
      },
    },

    series: [
      {
        id: "pas1",
        name: "PAS1",
        data: data[0],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[0],
      },
      {
        id: "pas2",
        name: "PAS2",
        data: data[1],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[1],
      },
      {
        id: "pas3",
        name: "PAS3",
        data: data[2],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[2],
      },
      {
        id: "pas4",
        name: "PAS4",
        data: data[3],
        tooltip: {
          valueDecimals: 2,
        },
        color: mycolor[3],
      },
    ],
  });
});

Highcharts.getJSON("./logsjson/204154601_vol.json", function (data) {
  // Create the chart
  Highcharts.stockChart("containerV", {
    navigation: {
      bindingsClassName: "tools-container", // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
    },

    stockTools: {
      gui: {
        enabled: false, // disable the built-in toolbar
      },
    },

    series: [
      {
        id: "vol1",
        name: "VOL1",
        data: data[0],
        tooltip: {
          valueDecimals: 3,
        },
        color: mycolor[0],
      },
      {
        id: "vol2",
        name: "VOL2",
        data: data[1],
        tooltip: {
          valueDecimals: 3,
        },
        color: mycolor[1],
      },
      {
        id: "vol3",
        name: "VOL3",
        data: data[2],
        tooltip: {
          valueDecimals: 3,
        },
        color: mycolor[2],
      },
      {
        id: "vol4",
        name: "VOL4",
        data: data[3],
        tooltip: {
          valueDecimals: 3,
        },
        color: mycolor[3],
      },
    ],
  });
});
