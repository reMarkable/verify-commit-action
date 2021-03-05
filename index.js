const core = require('@actions/core');

try {
  const ref = core.getInput('ref');
  const sha = core.getInput('sha');
  const path = core.getInput('path');

  if (!ref) {
    core.setFailed("Missing ref input");
    return 1
  }

  if (!sha) {
    core.setFailed("Missing sha input");
    return 1
  }

  if (!path) {
    core.setFailed("Missing path input");
    return 1
  }

  const fs = require("fs");

  if (!fs.existsSync(path)) {
    core.setFailed(`${path} does not exist`);
    return 1
  }

  const { exec } = require('child_process');

  exec(`git branch --format "%(refname)" --contains ${sha}`, {cwd: path}, (error, stdout, stderr) => {
    if (error) {
      core.setFailed(stderr);
      return
    }

    var os = require('os');
    var branches = stdout.split(os.EOL);
    var branches = branches.filter(function (element) {
      return element.trim() != '';
    });

    var index = branches.indexOf(ref);

    if (index == -1) {
      core.setFailed(`Unable to find "${sha}" in the history of ref "${ref}"`)
      return
    }

    console.log(`Found "${sha}" in the history of ref "${ref}"`)
  });

} catch (error) {
  core.setFailed(error.message);
}
