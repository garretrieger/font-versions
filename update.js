
function build_table(data) {
  let old_font_list = document.getElementById("font_list");
  let new_font_list = document.createElement("tbody");
  new_font_list.id = "font_list";

  for (let i = 0; i < data.familyVersions.length; i++) {
    let family = data.familyVersions[i];
    if (!family.upstreamCommit &&
	(!family.fontVersions.length || !family.fontVersions[0].version)) {
      continue;
    }

    let row = document.createElement("tr");
    let name = document.createElement("td");
    let version = document.createElement("td");
    let commit = document.createElement("td");

    name.innerText = family.name;

    if (family.upstreamCommit) {
      let link = document.createElement("a");
      link.href = "https://github.com/google/fonts/commit/" + family.upstreamCommit;
      link.innerText = family.upstreamCommit;
      commit.appendChild(link);
    } else {
      commit.innerText = "N/A";
    }

    if (family.fontVersions.length > 0) {
      version.innerText = family.fontVersions[0].version;
    } else {
      version.innerText = "N/A";
    }

    row.appendChild(name);
    row.appendChild(version);
    row.appendChild(commit);
    new_font_list.appendChild(row);
  }

  old_font_list.parentNode.replaceChild(new_font_list, old_font_list);
}

async function update_table() {
  let text_promise = fetch("https://fonts.sandbox.google.com/metadata/versions").then(response => response.text());
  text_promise.then(async (text) => {
    build_table(JSON.parse(text.substring(4)));
  }).catch(e => {
    console.log("Failed to load the version metadata: ", e);
  });
}

window.addEventListener('DOMContentLoaded', function() {
  update_table();
  let reload = document.getElementById("reload");
  reload.addEventListener("click", function() {
    update_table();
  });
});
