
function build_table(data, filter) {
  let old_font_list = document.getElementById("font_list");
  let new_font_list = document.createElement("tbody");
  new_font_list.id = "font_list";

  for (let i = 0; i < data.familyVersions.length; i++) {
    let family = data.familyVersions[i];
    if (!family.upstreamCommit &&
	(!family.fontVersions.length || !family.fontVersions[0].version)) {
      continue;
    }

    if (filter && family.name.indexOf(filter) == -1) {
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

async function update_table(sandbox, filter=null) {
  url = sandbox ? "https://fonts.sandbox.google.com/metadata/versions" : "https://fonts.google.com/metadata/versions";

  let active = document.getElementById(sandbox ? "sandbox" : "prod");
  let inactive = document.getElementById(!sandbox ? "sandbox" : "prod");
  active.classList.add("active")
  inactive.classList.remove("active");

  let text_promise = fetch(url).then(response => response.text());
  text_promise.then(async (text) => {
    build_table(JSON.parse(text.substring(4)), filter);
  }).catch(e => {
    console.log("Failed to load the version metadata: ", e);
    let old_font_list = document.getElementById("font_list");
    let new_font_list = document.createElement("tbody");
    new_font_list.id = "font_list";

    let row = document.createElement("tr");
    let cell = document.createElement("td");
    cell.innerText = "Failed to load the version metadata.";

    row.appendChild(cell);
    new_font_list.appendChild(row);
    old_font_list.parentNode.replaceChild(new_font_list, old_font_list);
  });
}

let filter = "";
let show_sandbox = true;

window.addEventListener('DOMContentLoaded', function() {
  update_table(show_sandbox);
  let sandbox = document.getElementById("sandbox");
  sandbox.addEventListener("click", function() {
    show_sandbox = true;
    update_table(show_sandbox, filter);
  });

  let prod = document.getElementById("prod");
  prod.addEventListener("click", function() {
    show_sandbox = false;
    update_table(show_sandbox, filter);
  });

  let filter_box = document.getElementById("filter");
  filter_box.addEventListener("change", function() {
    filter = filter_box.value;
    update_table(show_sandbox, filter);
  });

  let clear = document.getElementById("clear");
  clear.addEventListener("click", function() {
    filter = null;
    filter_box.value = "";
    update_table(show_sandbox, filter);
  });
});
