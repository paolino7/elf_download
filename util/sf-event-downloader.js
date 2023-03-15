const { getEventLogFiles, getEventLogFile } = require("./sf-event-log-file.js");
const { getEventLogQuery } = require("./sf-event-log-query.js");

const downloadEvent = async (mode, eventRequested, sfUrl, accessToken, sf_username) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("Start");
      if (mode === "FILE") {
        //2. Query EventLog
        const out = await getEventLogFiles(sfUrl, accessToken, eventRequested);
        console.log(
          `Need to download ${out.eventLogs.length} files for ${eventRequested}`
        );

        for (let i = 0; i < out.eventLogs.length; i++) {
          const emFile = out.eventLogs[i];
          const evtDate = emFile.logDate.substring(
            0,
            emFile.logDate.indexOf("T")
          );
          const emFilePath = `${eventRequested}_${evtDate}`;
          try {
            await getEventLogFile(
              `${sfUrl}${emFile.logFile}`,
              accessToken,
              emFilePath
            );
            console.log(`Downloaded ${eventRequested} - ${emFilePath} - DONE`);
          } catch (error) {
            console.error(error);
            throw error;
          }
        }
      } else if (mode === "QUERY") {
        try {
          console.log(`Start querying ${eventRequested}`);
          await getEventLogQuery(sf_username, eventRequested);
          console.log(`Saved ${eventRequested} - DONE`);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
      console.log("End");
      resolve();
    } catch (error) {
      console.error(error);
      reject();
    }
  });

module.exports = { downloadEvent };
