const { exec } = require("child_process");
const jsforce = require("jsforce");
const fs = require("fs");
const path = require('path');


class EventLogFile {
  id;
  eventType;
  logFile;
  logDate;
  interval;

  constructor(id, eventType, logFile, logDate, interval) {
    this.id = id;
    this.eventType = eventType;
    this.logFile = logFile;
    this.logDate = logDate;
    this.interval = interval;
  }
}

const getEventLogFiles = async (url, accessToken, eventLog) =>
  new Promise((resolve, reject) => {
    const conn = new jsforce.Connection({
      instanceUrl: url,
      accessToken: accessToken,
      version: "54.0",
    });
    
    const queryPath = path.join(__dirname, '..', 'query', 'eventLog.soql');
    const query = fs.readFileSync(queryPath, 'utf8');
    conn
      .query(
        `${query} AND EventType='${eventLog}' and Interval = 'Daily'`
      )
      .then((out) => {
        // const out = JSON.parse(result);
        console.log(JSON.stringify(out));
        const eventLogFiles = new Array();
        out.records.forEach((elfRecord) => {
          eventLogFiles.push(
            new EventLogFile(
              elfRecord.Id,
              elfRecord.EventType,
              elfRecord.LogFile,
              elfRecord.LogDate,
              elfRecord.Interval
            )
          );
        });

        resolve({ eventLogs: eventLogFiles });
      })
      .catch((error) => {
        reject(error);
      });
  });

const getEventLogFile = async (url, accessToken, filePath) =>
  new Promise(async (resolve, reject) => {
    console.debug(url, filePath);
    const { error, stdout, stderror } = await exec(
      `curl ${url} -data-urlencode -H $'Authorization: Bearer ${accessToken}' -H "Accept-Encoding: gzip" -H "X-PrettyPrint:1" -X GET -o  ${filePath}.tgz --silent`
    );
    if (error) {
      console.warn(error);
    }

    if (!stdout) {
      reject(stderror);
    }

    resolve();
  });

module.exports = { getEventLogFiles, getEventLogFile };
