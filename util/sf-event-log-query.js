const { spawn } = require("child_process");
const path = require("path");


const getEventLogQuery = async (username, eventRequested) =>
  new Promise(async (resolve, reject) => {
    const evtDate = new Date().toISOString();
    const emFilePath = `${eventRequested}_${evtDate}`;

    const queryPath = path.join(
      __dirname,
      "..",
      "query",
      `${eventRequested}.soql`
    );

    console.log(`Start saving ${eventRequested} in ${emFilePath}.csv`);
    await cmd(
      "bash",
      "-c",
      `sfdx data query --file ${queryPath} --target-org ${username} --result-format csv > ${emFilePath}.csv`
    ).catch((error) => {
      console.error(error);
      reject();
    });

    resolve();
  });

function cmd(...command) {
  let p = spawn(command[0], command.slice(1));
  return new Promise((resolveFunc) => {
    p.stdout.on("data", (x) => {
      process.stdout.write(x.toString());
    });
    p.stderr.on("data", (x) => {
      process.stderr.write(x.toString());
    });
    p.on("exit", (code) => {
      resolveFunc(code);
    });
  });
}

module.exports = { getEventLogQuery };
