const fs = require("fs/promises");
const path = require("path");

// const jsonfilename = "2023fortest.log";
// const jsonfilename = "204147395.log";
// const jsonfilename = "204147700_F9001998D7.txt";
const jsonfilename = "204144588_longtest5.log";
// const jsonfilename1 = "204148983_fire_home108.log";
// const jsonfilename1 = "204148980.log";

const devices = {};

toLogFile();

async function toLogFile() {
  const jsonlogFile = path.resolve(__dirname, "../../logs_big", jsonfilename);
  // const jsonlogFile1 = path.resolve(__dirname, "../../logs_big", jsonfilename1);

  try {
    await fs
      .readFile(jsonlogFile)
      .then((data) => fileToLineAndParse(data))
      .catch((err) => console.log(err.message));

    // await fs
    //   .readFile(jsonlogFile1)
    //   .then((data) => fileToLineAndParse(data))
    //   .catch((err) => console.log(err.message));

    // await fs
    //   .readFile(jsonlogFile2)
    //   .then((data) => fileToLineAndParse(data))
    //   .catch((err) => console.log(err.message));

    // await fs
    //   .readFile(jsonlogFile3)
    //   .then((data) => fileToLineAndParse(data))
    //   .catch((err) => console.log(err.message));

    // await fs
    //   .readFile(jsonlogFile4)
    //   .then((data) => fileToLineAndParse(data))
    //   .catch((err) => console.log(err.message));

    dataGrouping(devices);
  } catch (err) {
    console.log(err);
  }
}

function dataGrouping(obj) {
  for (var ppkSN in obj) {
    const cnt = [];
    const blue_delta = [];
    const ir_delta = [];
    const ir_fon = [];
    const ir_dustStatic = [];
    const temperature = [];
    const COppm = [];

    console.log(ppkSN);
    for (var sensorSN in obj[ppkSN]) {
      const sensor = obj[ppkSN];
      const mas = sensor[sensorSN];
      const cntMini = [];
      const blue_deltaMini = [];
      const ir_deltaMini = [];
      const ir_fonMini = [];
      const ir_dustStaticMini = [];
      const temperatureMini = [];
      const COppmMini = [];
      var lastcnt = 0;

      console.log("\t", sensorSN);
      // console.log('mas',mas);
      //masToFile(ppkSN+"_"+sensorSN, JSON.stringify(mas));

      mas.forEach(function (item, i) {
        const utime = item.time * 1000;
        if (lastcnt == 0) lastcnt = item.cnt - 1;
        const deeltacnt = item.cnt - lastcnt - 1;
        lastcnt = item.cnt;
        cntMini.push([utime, deeltacnt]);
        blue_deltaMini.push([utime, item.blue_delta]);
        ir_deltaMini.push([utime, item.ir_delta]);
        ir_fonMini.push([utime, item.ir_fon]);
        ir_dustStaticMini.push([utime, item.ir_dustStatic]);
        temperatureMini.push([utime, item.temperature]);
        COppmMini.push([utime, item.COppm]);
      });
      cnt.push(cntMini);
      blue_delta.push(blue_deltaMini);
      ir_delta.push(ir_deltaMini);
      ir_fon.push(ir_fonMini);
      ir_dustStatic.push(ir_dustStaticMini);
      temperature.push(temperatureMini);
      COppm.push(COppmMini);
    }

    masToFile(ppkSN + "_cnt", JSON.stringify(cnt));
    masToFile(ppkSN + "_bl_delta", JSON.stringify(blue_delta));
    masToFile(ppkSN + "_ir_delta", JSON.stringify(ir_delta));
    masToFile(ppkSN + "_ir_fon", JSON.stringify(ir_fon));
    masToFile(ppkSN + "_ir_dustStatic", JSON.stringify(ir_dustStatic));
    masToFile(ppkSN + "_tem", JSON.stringify(temperature));
    masToFile(ppkSN + "_COppm", JSON.stringify(COppm));

    // masToFile(JSON.stringify(cnt, null, " ")); // формат для посмотреть
    console.log("ok");
  }
}

function fileToLineAndParse(fileData) {
  const array = fileData.toString().split(/\r?\n/);
  for (i in array) {
    const values = strParseJsonDiag(array[i]);

    if (!values[1].match("^F9")) {
      continue; // пропуск для других датчиков
    }

    // if (values[0] != 204147395) {
    //   continue;
    // }
    if (values[3] === 0) {
      continue;
    }

    const deviceSN = values[0];
    const sensorSN = values[1];
    const sensorData = {
      time: values[2],
      cnt: values[3],
      blue_delta: values[4],
      ir_delta: values[5],
      ir_fon: values[6],
      ir_dustStatic: values[7],
      temperature: values[8],
      COppm: values[9],
    };
    addDataToSensor(deviceSN, sensorSN, sensorData);
  }
}

function addDataToSensor(device, sensor, data) {
  if (!devices.hasOwnProperty(device)) {
    devices[device] = { [sensor]: [data] };
  } else {
    const d = devices[device];
    if (!d.hasOwnProperty(sensor)) {
      devices[device] = { [sensor]: [data] };
    } else {
      d[sensor].push(data);
    }
    devices[device] = { ...devices[device], ...d };
  }
}

var timefp = 0;
var timecntfp = 0;
function strParseJsonDiag(strJSON) {
  const obj = JSON.parse(strJSON);
  const str = obj.diag;
  const vSN = str.match("(?<=SN:)[0-9a-fA-F]*");
  const ver = str.match("(?<=ver:)[0-9.]*");
  // buf[i++] = sensor_fire.blue.delta;
  // buf[i++] = sensor_fire.ir.delta;
  // buf[i++] = sensor_fire.ir.fon;
  // buf[i++] = sensor_fire.ir.dustStatic;
  // buf[i++] = sensor.temperatureSensorX10;
  // buf[i++] = sensor_fire.COppm;
  const v50 = str.match("(?<=50=)\\d+");
  const v61 = str.match("(?<=61=)\\d+");
  const v62 = str.match("(?<=62=)\\d+");
  const v63 = str.match("(?<=63=)\\d+");
  const v64 = str.match("(?<=64=)\\d+");
  const v65 = str.match("(?<=65=)-?\\d+");
  const v66 = str.match("(?<=66=)\\d+");
  const sn = vSN ? vSN[0] : "";
  const cnt = v50 ? v50[0] * 1 : 0;
  var blue_delta = v61 ? v61[0] * 1 : 0;
  if (blue_delta & 0x80000000) {
    blue_delta = (0xffffffff - blue_delta + 1) * -1;
  }
  var ir_delta = v62 ? v62[0] * 1 : 0;
  if (ir_delta & 0x80000000) {
    ir_delta = (0xffffffff - ir_delta + 1) * -1;
  }
  const ir_fon = v63 ? v63[0] * 1 : 0;
  const ir_dustStatic = v64 ? v64[0] * 1 : 0;
  const temperature = v65 ? v65[0] / 10 : 0;
  var COppm = v66 ? v66[0] * 1 : 0;
  if (COppm & 0x80000000) {
    COppm = (0xffffffff - COppm + 1) * -1;
  }
  var time = obj.time;
  time += 2 * 60 * 60; // +2часа
  if (timefp == time) {
    timecntfp++;
    time += 2 * timecntfp;
  } else {
    timefp = time;
    if (timecntfp > 1) {
      time += 5;
    }
    timecntfp = 0;
  }
  const data = [
    obj.did,
    sn,
    time,
    cnt,
    blue_delta,
    ir_delta,
    ir_fon,
    ir_dustStatic,
    temperature,
    COppm,
  ];
  return data;
}

async function masToFile(nameFile, content) {
  const filename = nameFile + ".json";
  const logFile = path.resolve(__dirname, "logsjson", filename);
  try {
    await fs.appendFile(logFile, content + "\n");
  } catch (err) {
    console.log(err);
  }
}

// JSON.stringify для преобразования объектов в JSON.
// JSON.parse для преобразования JSON обратно в объект.
