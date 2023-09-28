import fs from 'fs';


export const getElapsedTime = ((startTime, endTime) => {

    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    const seconds = Math.round(timeDiff % 60);
    // let secondsAsString = seconds < 10 ? "0" + seconds : seconds;
    
    timeDiff = Math.floor(timeDiff / 60);
    const minutes = Math.round(timeDiff % 60);
    // let minutesAsString = minutes < 10 ? "0" + minutes : minutes;
    
    timeDiff = Math.floor(timeDiff / 60);
    const hours = Math.round(timeDiff % 24);
    timeDiff = Math.floor(timeDiff / 24);
    const days = timeDiff;
    const totalHours = hours + (days * 24); // add days to hours
    // let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours;

    if (totalHours === 0) {
        if (minutes === 0) {
            return seconds + " seconds";
        } else {
            return minutes + " minutes " + seconds + " seconds";
        }
    } else {
        return totalHours + " hours " + minutes + " minutes " + seconds + " seconds";
    }
})

export const handleMissingEnvParam = ((paramName) => {
    throw `${paramName} is not specified. Please check your .env file.`;
})

export const handleMissingEntityProperty = (propertyName => {
    throw `Missing mandatory property '${propertyName}'.`;
})

export const printSummaryLine = ((msg, startRunTime) => {
    console.log(`${msg} in ${((new Date() - startRunTime) / 1000).toFixed(2)} sec.`);
})

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const getRandomIntInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const writeToFile = (outputFile, data, appendMode = false) => {

    if (appendMode) {
        fs.appendFile(outputFile, data, (err) => {
            if (err) console.error('Couldn\'t append the data');
        });
    } else {
        fs.writeFile(outputFile, data, (err) => {
            if (err) console.error('Couldn\'t write the data');
        });
    }
}

export const generateString = ((prefix, suffix) => {
    return `${prefix}-${suffix}`;
})