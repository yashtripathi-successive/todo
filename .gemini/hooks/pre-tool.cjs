
const fs = require("node:fs");

const envPattern =
  /(^|[\\/"'\s])\.env(?:\.[\w.-]+)?(?=$|[\\/"'\s])/i;

function respond(decision, reason) {
  console.log(JSON.stringify({ decision, reason }));
  process.exitCode = decision === "deny" ? 1 : 0;
}

try {
  const input = JSON.parse(
    fs.readFileSync(0, "utf8")
  );

  const args =
    input.tool_input ?? input.toolCall?.args;

  if (!args || typeof args !== "object") {
    respond("deny", "Cannot inspect tool arguments.");
  } else if (envPattern.test(JSON.stringify(args))) {
    respond("deny", "Access to .env files is prohibited.");
  } else {
    respond("allow", "No protected .env reference detected.");
  }
} catch (error) {
  respond("deny", "Pre-tool validation failed.");
}
