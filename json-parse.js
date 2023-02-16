const fs = require("fs/promises");
const path = require("path");

const jsonfilename = '20230209-14.log';

const devices = {};

// const deviceSN1 = 204148983;
// const deviceSN2 = 204148984;
// const sensorSN1 = 'E800D9F751';
// const sensorSN2 = 'E800D9F752';
// const sensorData = {
//     time: 1,
//     tem: 2,
//     pas: 3,
//     hum: 4,
//     rom: 5
// };
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
// addDataToSensor(deviceSN1, sensorSN1, 1);
// addDataToSensor(deviceSN1, sensorSN1, 2);
// addDataToSensor(deviceSN1, sensorSN2, 3);
// addDataToSensor(deviceSN2, sensorSN1, 4);
// addDataToSensor(deviceSN2, sensorSN1, 5);
// addDataToSensor(deviceSN2, sensorSN2, 6);
// addDataToSensor(deviceSN2, sensorSN2, 7);
// console.log(devices);




toLogFile();

function dataGrouping(obj) {
    const tem = [];
    const pas = [];
    const hum = [];
    const rom = [];

    for (var ppkSN in obj) {
        console.log(ppkSN);
        for (var sensorSN in obj[ppkSN]) {
            const sensor = obj[ppkSN];
            const mas = sensor[sensorSN];
            const temMini = [];
            const pasMini = [];
            const humMini = [];
            const romMini = [];

            console.log('\t', sensorSN);
            // console.log('mas',mas);

            mas.forEach(function (item, i) {
                const utime = item.time*1000;
                temMini.push([utime, item.tem]);
                pasMini.push([utime, item.pas]);
                humMini.push([utime, item.hum]);
                romMini.push([utime, item.rom]);
            });
            tem.push(temMini);
            pas.push(pasMini);
            hum.push(humMini);
            rom.push(romMini);
        }
        // console.log("tem", tem);
        // console.log("pas", pas);
        // console.log("hum", hum);
        // console.log("rom", rom);
        masToFile(ppkSN+"_tem", JSON.stringify(tem));
        masToFile(ppkSN+"_pas", JSON.stringify(pas));
        masToFile(ppkSN+"_hum", JSON.stringify(hum));
        masToFile(ppkSN+"_rom", JSON.stringify(rom));
        console.log("ok");
    }
    
}


async function toLogFile() {
    // const jsonfilename = '2023fortest' + ".log";
    const jsonlogFile = path.resolve(__dirname, "logs", jsonfilename);
    try {
        await fs.readFile(jsonlogFile)
            .then(data => fileToLineAndParse(data))
            .catch(err => console.log(err.message));

        // console.log(devices);
        dataGrouping(devices);
        // masToFile(JSON.stringify(devices));
        // masToFile(JSON.stringify(devices, null, ' ')); // формат для посмотреть
    } catch (err) {
        console.log(err);
    }
}

function fileToLineAndParse(fileData) {
    const array = fileData.toString().split(/\r?\n/);
    for (i in array) {
        const values = strParseJsonDiag(array[i]);

        if (!(values[1].includes('E8'))) {
            continue; // пропуск для других датчиков
        }

        const deviceSN = values[0];
        const sensorSN = values[1];
        const sensorData = {
            time: values[2],
            tem: values[3],
            pas: values[4],
            hum: values[5],
            rom: values[6]
        };
        addDataToSensor(deviceSN, sensorSN, sensorData);
    }
}

function strParseJsonDiag(strJSON) {
    const obj = JSON.parse(strJSON);
    const str = obj.diag;
    const vSN = str.match('(?<=SN:)[0-9a-fA-F]*');
    const v51 = str.match('(?<=51=)\\d+');
    const v52 = str.match('(?<=52=)\\d+');
    const v53 = str.match('(?<=53=)\\d+');
    const v54 = str.match('(?<=54=)\\d+');
    const sn = vSN ? vSN[0] : '';
    const temperature = v51 ? v51[0] / 100 : 0;
    const pressure = v52 ? parseFloat((v52[0] * 0.0075006).toFixed(2)) : 0; // *0.0075006 mmHg
    const humidity = v53 ? parseFloat((v53[0] / 1000).toFixed(1)) : 0;
    const resistor = v54 ? v54[0] / 1000 : 0;
    const data = [
        obj.did,
        sn,
        obj.time,
        temperature,
        pressure,
        humidity,
        resistor,
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