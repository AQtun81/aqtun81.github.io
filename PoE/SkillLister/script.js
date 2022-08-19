skillListElement = document.getElementById('skilllist');
var skills,
    skillsFetch,
    skillsFetchFull,
    bDataset = false,
    previousSearch = "",
    skillCountDisplay = 459;
getAndDisplaySkills();
enabledTypes = [];
disabledTypes = [];
enabledWeaponTypes = [];
disabledWeaponTypes = [];
var URLSearchParams = new URLSearchParams(window.location.search);
function toggleType(button) {
  if (!button.classList.contains('chip')) return;
  var state;

  if (button.classList[1] == undefined) {
    state = 0;
  } else {
    state = parseInt(button.classList[1]);
  }

  switch (state) {
    case 0:
      add(enabledTypes);
      button.classList.add("1");
      break;
    case 1:
      remove(enabledTypes);
      add(disabledTypes);
      button.classList.remove("1");
      button.classList.add("2");
      break;
    case 2:
      remove(disabledTypes);
      button.classList.remove("2");
      break;
  }

  storeSearchParams();
  filterSkills();
  searchSkills(previousSearch);
  displaySkills();
  updateSkillCount();


  function add(array) {
    array.push(button.attributes.skilltag.value);
  }

  function remove(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == button.attributes.skilltag.value) {
        array.splice(i, 1);
        break;
      }
    }
  }
}

function toggleWeaponType(button) {
  if (!button.classList.contains('chip')) return;
  var state;

  if (button.classList[1] == undefined) {
    state = 0;
  } else {
    state = parseInt(button.classList[1]);
  }

  switch (state) {
    case 0:
      add(enabledWeaponTypes);
      button.classList.add("1");
      break;
    case 1:
      remove(enabledWeaponTypes);
      add(disabledWeaponTypes);
      button.classList.remove("1");
      button.classList.add("2");
      break;
    case 2:
      remove(disabledWeaponTypes);
      button.classList.remove("2");
      break;
  }

  storeSearchParams();
  filterSkills();
  searchSkills(previousSearch);
  displaySkills();
  updateSkillCount();


  function add(array) {
    array.push(button.attributes.weapontag.value);
  }

  function remove(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == button.attributes.weapontag.value) {
        array.splice(i, 1);
        return;
      }
    }
  }
}

function filterSkills() {
  if (bDataset) {
    skills = skillsFetchFull.slice();
  } else {
    skills = skillsFetch.slice();
  }

  // skills
  if (enabledTypes.length != 0 || disabledTypes.length != 0) {

    for (var i = 0; i < disabledTypes.length; i++) {
      for (var o = 0; o < skills.length; o++) {
        for (var p = 0; p < skills[o].Tags.length; p++) {
          if (skills[o].Tags[p] == disabledTypes[i]) {
            skills.splice(o, 1);
            o--;
            break;
          }
          if (p == skills[o].Tags.length - 1) {
            break;
          }
        }
      }
    }

    for (var i = 0; i < enabledTypes.length; i++) {
      for (var o = 0; o < skills.length; o++) {
        for (var p = 0; p < skills[o].Tags.length; p++) {
          if (skills[o].Tags[p] == enabledTypes[i]) {
            break;
          }
          if (p == skills[o].Tags.length - 1) {
            skills.splice(o, 1);
            o--;
            break;
          }
        }
      }
    }

  }

  // weapons
  if (enabledWeaponTypes.length != 0 || disabledWeaponTypes.length != 0) {

    for (var i = 0; i < disabledWeaponTypes.length; i++) {
      for (var o = 0; o < skills.length; o++) {
        for (var p = 0; p < skills[o].WeaponTags.length; p++) {
          if (skills[o].WeaponTags[p] == disabledWeaponTypes[i]) {
            skills.splice(o, 1);
            o--;
            break;
          }
          if (p == skills[o].WeaponTags.length - 1) {
            break;
          }
        }
      }
    }

    for (var i = 0; i < enabledWeaponTypes.length; i++) {
      for (var o = 0; o < skills.length; o++) {
        for (var p = 0; p < skills[o].WeaponTags.length; p++) {
          if (skills[o].WeaponTags[p] == enabledWeaponTypes[i]) {
            break;
          }
          if (p == skills[o].WeaponTags.length - 1) {
            skills.splice(o, 1);
            o--;
            break;
          }
        }
      }
    }

  }


}

function searchChange(text) {
  if (previousSearch.length < text.length) {
    previousSearch = text;
    searchSkills(text);
    displaySkills();
    updateSkillCount();
  } else {
    previousSearch = text;
    filterSkills();
    searchSkills(text);
    displaySkills();
    updateSkillCount();
  }
  storeSearchParams();
}

function searchSkills(query) {
  if (query == "") return;
  for (var i = 0; i < skills.length; i++) {
    // 0 = match, -1 = no match
    var string = skills[i].Name.toLowerCase();
    if (string.search(query.toLowerCase()) == -1) {
      skills.splice(i, 1);
      i--;
    }
  }
}

function displaySkills() {
  result = '';
  if (skills.length == 0) {
    skillListElement.innerHTML = result;
    return;
  }
  for (var i = 0; i < skills.length; i++) {
    result += "<a class='skill' i='" + i + "' href='" + 'https://www.poewiki.net/wiki/' + skills[i].Name.replace(/ /g, '_').replace(/'/g, '%27') + "'><img src=" + '"' + "SkillIcons/" + skills[i].Name.replace(/'/g, '%27').toLowerCase() + ".png" + '"' + "><p>" + skills[i].Name + "</p></a>"
  }
  skillListElement.innerHTML = result;

  for (var element of document.getElementsByClassName('skill')) {
    addSkillMenuEvents(element);
  }
}

function getAndDisplaySkills() {
  fetch('data.json')
  .then(response => response.json())
  .then(data => {
      skillsFetch = data;
      skills = data;
      filterSkills();
      searchSkills(previousSearch);
      displaySkills();
      updateSkillCount();
  }).then(
    fetch("data_full.json")
    .then(response => response.json())
    .then(data => {
        skillsFetchFull = data;
        applySearchParams();
    })
  );
}

function addSkillMenuEvents(element) {
  element.addEventListener('mouseover', function(ev) {

      var menu = document.getElementById('skillMenu');
      targetName = element.lastChild.innerText;
      targetDescription = this.attributes.href.nodeValue;

      document.getElementById('skillMenuName').innerText = targetName;
      document.getElementById('skillMenuDescription').innerText = skills[element.attributes.i.value].Description;
      document.getElementById('skillMenuSkillTags').innerText = skillTagsToString(skills[element.attributes.i.value].Tags);
      document.getElementById('skillMenuWeaponTags').innerText = weaponTagsToString(skills[element.attributes.i.value].WeaponTags);

      menu.style.display = "block";
      menu.style.left = ev.pageX + 20 + 'px';
      menu.style.left = element.getBoundingClientRect().x + 74 + "px";
      if (ev.clientY > window.innerHeight - 200) { // - menu.getBoundingClientRect().y
        menu.style.top = ev.pageY - 155 + 'px';
        menu.style.top = element.getBoundingClientRect().y - document.body.getBoundingClientRect().y - menu.getBoundingClientRect().height + "px";
      } else {
        menu.style.top = ev.pageY + 'px';
        menu.style.top = element.getBoundingClientRect().y - document.body.getBoundingClientRect().y + "px";
      }
      return false;
  }, false);

  element.addEventListener('mouseout', function(ev) {
      var menu = document.getElementById('skillMenu');
      menu.style.display = "none";
      return false;
  }, false);

}

function skillTagsToString(SkillTags) {
  var result = "";

  if (SkillTags.length == 0) return "No Skill Tags"

  for (var SkillTag of SkillTags) {
    switch (SkillTag) {
      case 0:
        result += "Attack, ";
        break;
      case 1:
        result += "Spell, ";
        break;
      case 2:
        result += "Projectile, ";
        break;
      case 4:
        result += "Buff, ";
        break;
      case 5:
        result += "Minion, ";
        break;
      case 7:
        result += "Area, ";
        break;
      case 8:
        result += "Duration, ";
        break;
      case 9:
        result += "Shield, ";
        break;
      case 18:
        result += "Chaining, ";
        break;
      case 19:
        result += "Melee, ";
        break;
      case 20:
        result += "Strike, ";
        break;
      case 25:
        result += "Totem, ";
        break;
      case 27:
        result += "Physical, ";
        break;
      case 28:
        result += "Fire, ";
        break;
      case 29:
        result += "Cold, ";
        break;
      case 30:
        result += "Lightning, ";
        break;
      case 32:
        result += "Trap, ";
        break;
      case 33:
        result += "Movement, ";
        break;
      case 34:
        result += "Damage Over Time, ";
        break;
      case 35:
        result += "Mine, ";
        break;
      case 36:
        result += "Trigger, ";
        break;
      case 37:
        result += "Vaal, ";
        break;
      case 38:
        result += "Aura, ";
        break;
      case 41:
        result += "Chaos, ";
        break;
      case 47:
        result += "Channelling, ";
        break;
      case 50:
        result += "Golem, ";
        break;
      case 62:
        result += "Warcry, ";
        break;
      case 63:
        result += "Instant, ";
        break;
      case 64:
        result += "Brand, ";
        break;
      case 68:
        result += "Curse, ";
        break;
      case 77:
        result += "Guard, ";
        break;
      case 78:
        result += "Travel, ";
        break;
      case 79:
        result += "Blink, ";
        break;
      case 83:
        result += "Nova, ";
        break;
      case 91:
        result += "Slam, ";
        break;
      case 96:
        result += "Hex, ";
        break;
      case 97:
        result += "Mark, ";
        break;
      case 99:
        result += "Orb, ";
        break;
      case 101:
        result += "Prismatic, ";
        break;
      case 103:
        result += "Arcane, ";
        break;
      case 106:
        result += "Link, ";
        break;
      default:
        break;
        result += "Tag_" + SkillTag + ", ";
    }
  }
  result = result.substring(0, result.length - 2);
  return result;
}

function weaponTagsToString(WeaponTags) {
  var result = "";

  if (WeaponTags.length == 0) return "Any Weapon";

  for (var WeaponTag of WeaponTags) {
    switch (WeaponTag) {
      case 6:
        result += "Claw, ";
        break;
      case 7:
        result += "Dagger, ";
        break;
      case 8:
        result += "Wand, ";
        break;
      case 9:
        result += "One Hand Sword, ";
        break;
      case 10:
        result += "Thrusting One Hand Sword, ";
        break;
      case 11:
        result += "One Hand Axe, ";
        break;
      case 12:
        result += "One Hand Mace, ";
        break;
      case 13:
        result += "Bow, ";
        break;
      case 14:
        result += "Staff, ";
        break;
      case 15:
        result += "Two Hand Sword, ";
        break;
      case 16:
        result += "Two Hand Axe, ";
        break;
      case 17:
        result += "Two Hand Mace, ";
        break;
      case 26:
        result += "Shield, ";
        break;
      case 32:
        result += "Sceptre, ";
        break;
      case 36:
        result += "Unarmed, ";
        break;
      case 56:
        result += "Rune Dagger, ";
        break;
      case 57:
        result += "Warstaff, ";
        break;
    }
  }
  result = result.substring(0, result.length - 2);
  return result;
}

function updateSkillCount() {
  var quantity = document.getElementsByClassName("skill").length;

  if (quantity != skillCountDisplay) {
    element = document.getElementById("matchingSkillsHeader");
    if (skillCountDisplay > quantity)
    {
      skillCountDisplay -= Math.ceil((skillCountDisplay - quantity) * 0.05);
    }
    else
    {
      skillCountDisplay += Math.ceil((quantity - skillCountDisplay) * 0.05);
    }
    element.innerText = skillCountDisplay + " Matching Skills:";
    requestAnimationFrame(updateSkillCount);
  }
}

function toggleDataset(button) {
  if (!button.classList.contains('chip')) return;
  var state;

  if (button.classList[1] == undefined) {
    state = 0;
  } else {
    state = 1;
  }

  switch (state) {
    case 0:
      bDataset = true;
      button.classList.add("1");
      break;
    case 1:
      bDataset = false;
      button.classList.remove("1");
      break;
  }

  storeSearchParams();
  filterSkills();
  searchSkills(previousSearch);
  displaySkills();
  updateSkillCount();
}

function applySearchParams() {
  URLSearchParams.forEach(function(value, key) {
    var arrayValue = value.split(",");
    if (arrayValue[0].length > 0) {
      switch (key) {
        case "es":
          enabledTypes = arrayValue;
          enabledTypes.forEach(skill => {
            setStyle(skill, "skill", 1);
          });
          break;
        case "ds":
          disabledTypes = arrayValue;
          disabledTypes.forEach(skill => {
            setStyle(skill, "skill", 2);
          });
          break;
        case "ew":
          enabledWeaponTypes = arrayValue;
          enabledWeaponTypes.forEach(weapon => {
            setStyle(weapon, "weapon", 1);
          });
          break;
        case "dw":
          disabledWeaponTypes = arrayValue;
          disabledWeaponTypes.forEach(weapon => {
            setStyle(weapon, "weapon", 2);
          });
          break;
        case "d":
          bDataset = arrayValue[0] == "true";
          if (bDataset) {
            document.querySelector('button[onclick="toggleDataset(this);"]').classList.add(1);
          }
          break;
        case "s":
          previousSearch = arrayValue.join();
          document.getElementById("skillNameSearch").value = previousSearch;
          break;
      }
    }
    filterSkills();
    searchSkills(previousSearch);
    displaySkills();
    updateSkillCount();
  });
}

// style 1 = enabled, 2 = disabled
function setStyle(id, type, style) {
  if (type == "skill") {
    document.querySelector('button[skilltag="' + id + '"]').classList.add(style);
  } else { // weapon
    document.querySelector('button[weapontag="' + id + '"]').classList.add(style);
  }
}

function storeSearchParams() {
  // Enabled Skills
  URLSearchParams.set("es", enabledTypes);
  // Disabled Skills
  URLSearchParams.set("ds", disabledTypes);
  // Enabled Weapons
  URLSearchParams.set("ew", enabledWeaponTypes);
  // Disabled Weapons
  URLSearchParams.set("dw", disabledWeaponTypes);
  // Dataset
  URLSearchParams.set("d", bDataset);
  // Search
  URLSearchParams.set("s", previousSearch);
  history.replaceState({}, '', location.pathname + '?' + URLSearchParams.toString());
}

function resetFilter() {
  elements = document.querySelectorAll('button.chip');
  elements.forEach(element => {
    for (let i = 0; i < element.classList.length; i++) {
      if (i > 0) {
        element.classList.remove(element.classList[i]);
      }
    }
  });

  document.getElementById("skillNameSearch").value = "";

  enabledTypes = [];
  disabledTypes = [];
  enabledWeaponTypes = [];
  disabledWeaponTypes = [];
  bDataset = false;
  previousSearch = "";

  filterSkills();
  displaySkills();
  updateSkillCount();
  storeSearchParams();
}

function collapseTagSection(element) {
  var current = getComputedStyle(element).height;
  element.style.height = current;
  element.offsetWidth; // force repaint
  element.style.height = "0px";
}

function expandTagSection(element) {
  element.style.height = "initial";
  var target = getComputedStyle(element).height;
  element.style.height = "0px";
  element.offsetWidth; // force repaint
  element.style.height = target;
  setTimeout(function() { removeHeight(element); }, 150);
}

function removeHeight(element) {
  if (element.style.height == "0px") return
  element.style.height = null;
}

function collapse(element) {
  collapseTagSection(element.parentElement.lastElementChild);
  element.onclick = function(){expand(element)};
  element.style.opacity = 0.5;
}

function expand(element) {
  expandTagSection(element.parentElement.lastElementChild);
  element.onclick = function(){collapse(element)};
  element.style.opacity = 1;
}