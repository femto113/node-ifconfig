var ifconfig = require("./index.js");

ifconfig(function (err, results) {
  if (err) {
    console.log("ERROR: %s\n%s", err, results);
    process.abort();
  }

  console.log("%s", JSON.stringify(results, null, "  "));
});
