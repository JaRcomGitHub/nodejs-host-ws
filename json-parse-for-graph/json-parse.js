const fs = require("fs/promises");
const path = require("path");

const jsonfilename = '20230208-__.log';

const devices = {};

toLogFile();

async function toLogFile() {
    const jsonlogFile = path.resolve(__dirname, "logs", jsonfilename);

    try {
        await fs.readFile(jsonlogFile)
            .then(data => fileToLineAndParse(data))
            .catch(err => console.log(err.message));

        dataGrouping(devices);

    } catch (err) {
        console.log(err);
    }
}

function dataGrouping(obj) {
    for (var ppkSN in obj) {
        const tem = [];
        const pas = [];
        const hum = [];
        const rom = [];
        const vol = [];
        console.log(ppkSN);
        for (var sensorSN in obj[ppkSN]) {
            const sensor = obj[ppkSN];
            const mas = sensor[sensorSN];
            const temMini = [];
            const pasMini = [];
            const humMini = [];
            const romMini = [];
            const volMini = [];

            console.log('\t', sensorSN);
            // console.log('mas',mas);
            //masToFile(ppkSN+"_"+sensorSN, JSON.stringify(mas));

            let count = 0;
            const data = [0,0,0,0,0,0];
            mas.forEach(function (item, i) {
                // const utime = item.time*1000;
                // temMini.push([utime, item.tem]);
                // pasMini.push([utime, item.pas]);
                // humMini.push([utime, item.hum]);
                // romMini.push([utime, item.rom]);
                // volMini.push([utime, item.vol]);

                count += 1;
                //data[0] += item.time;
                data[1] += item.tem;
                data[2] += item.pas;
                data[3] += item.hum;
                data[4] += item.rom;
                data[5] += item.vol;

                if (count === 4){
                    count = 0;
                    //item.time = data[0]/4;
                    item.tem  = (data[1].toFixed(2)/4);
                    item.pas  = (data[2].toFixed(2)/4);
                    item.hum  = (data[3].toFixed(1)/4);
                    item.rom  = (data[4].toFixed(3)/4);
                    item.vol  = (data[5].toFixed(3)/4);
                    data[0] = 0;
                    data[1] = 0;
                    data[2] = 0;
                    data[3] = 0;
                    data[4] = 0;
                    data[5] = 0;

                    const utime = item.time*1000;
                    temMini.push([utime, item.tem]);
                    pasMini.push([utime, item.pas]);
                    humMini.push([utime, item.hum]);
                    romMini.push([utime, item.rom]);
                    volMini.push([utime, item.vol]);
                }
            });
            tem.push(temMini);
            pas.push(pasMini);
            hum.push(humMini);
            rom.push(romMini);
            vol.push(volMini);
        }

        masToFile(ppkSN+"_tem", JSON.stringify(tem));
        masToFile(ppkSN+"_pas", JSON.stringify(pas));
        masToFile(ppkSN+"_hum", JSON.stringify(hum));
        masToFile(ppkSN+"_rom", JSON.stringify(rom));
        masToFile(ppkSN+"_vol", JSON.stringify(vol));
        // masToFile(JSON.stringify(tem, null, ' ')); // ???????????? ?????? ????????????????????
        console.log("ok");
    }
}

function fileToLineAndParse(fileData) {
    const array = fileData.toString().split(/\r?\n/);
    for (i in array) {
        const values = strParseJsonDiag(array[i]);

        if (!(values[1].match('^E8'))) {
            continue; // ?????????????? ?????? ???????????? ????????????????
        }

        const deviceSN = values[0];
        const sensorSN = values[1];
        const sensorData = {
            time: values[2],
            tem: values[3],
            pas: values[4],
            hum: values[5],
            rom: values[6],
            vol: values[7]
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

function strParseJsonDiag(strJSON) {
    const obj = JSON.parse(strJSON);
    const str = obj.diag;
    const vSN = str.match('(?<=SN:)[0-9a-fA-F]*');
    const v51 = str.match('(?<=51=)\\d+');
    const v52 = str.match('(?<=52=)\\d+');
    const v53 = str.match('(?<=53=)\\d+');
    const v54 = str.match('(?<=54=)\\d+');
    const v55 = str.match('(?<=55=)\\d+');
    const sn = vSN ? vSN[0] : '';
    const temperature = v51 ? v51[0] / 100 : 0;
    const pressure = v52 ? parseFloat((v52[0] * 0.0075006).toFixed(2)) : 0; // *0.0075006 mmHg
    const humidity = v53 ? parseFloat((v53[0] / 1000).toFixed(1)) : 0;
    const resistor = v54 ? v54[0] / 1000 : 0;
    const voltage = v55 ? v55[0] * 2 / 1000 : 0;
    const data = [
        obj.did,
        sn,
        obj.time,
        temperature,
        pressure,
        humidity,
        resistor,
        voltage,
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



// JSON.stringify ?????? ???????????????????????????? ???????????????? ?? JSON.
// JSON.parse ?????? ???????????????????????????? JSON ?????????????? ?? ????????????.