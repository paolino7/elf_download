require("dotenv").config();
const { sfdxAuthenticate } = require("./util/sf-auth");
const { downloadEvent } = require("./util/sf-event-downloader");

const sf_username = process.env.SF_USERNAME;
const eventsRequestedStr = process.env.EVENT_LOG;
const eventsRequestedQueryStr = process.env.EVENT_LOG_QUERY;

const authPromise = sfdxAuthenticate(sf_username);
const date = "date";
const eventsRequested = eventsRequestedStr.split(",");
const eventsRequestedQuery = eventsRequestedQueryStr.split(",");

authPromise.then(async (sfAuthInfo) => {
  console.log(`Connected  to ${sfAuthInfo.sfUrl} as ${sf_username}`);

  try {
    if (eventsRequested && eventsRequested.length > 0 && eventsRequested[0]) {
      for (let i = 0; i < eventsRequested.length; i++) {
        const eventRequested = eventsRequested[i];
        console.log(`Start Program with search for ${eventRequested}`);
        try {
          await downloadEvent(
            "FILE",
            eventRequested,
            sfAuthInfo.sfUrl,
            sfAuthInfo.accessToken,
            sf_username
          );
          console.log(`--- DONE with ${eventRequested} --- `);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    }
    if (eventsRequestedQuery && eventsRequestedQuery.length > 0 && eventsRequestedQuery[0]) {
      for (let i = 0; i < eventsRequestedQuery.length; i++) {
        const eventRequested = eventsRequestedQuery[i];
        console.log(`Start Program with search for ${eventRequested}`);
        try {
          await downloadEvent(
            "QUERY",
            eventRequested,
            sfAuthInfo.sfUrl,
            sfAuthInfo.accessToken,
            sf_username
          );
          console.log(`--- DONE with ${eventRequested} --- `);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    }

    console.log("End");
  } catch (error) {
    console.error(error);
  } finally {
    //   fs.rmSync(tempFolderName, { recursive: true, force: true });
  }
});
