// made for path of exile skill lister
// use at https://pathofexile.gamepedia.com/Skill_gem
// copy console output

// version with half-automatic weapons
// unarmed attacks need to be added manually
// attacks with specific allowed weapon types need exessive tags removed

result = '';

elements = document.getElementsByClassName('item-box -gem');
var hasBowTag = 0;
var hasMeleeTag = 0;
var hasSpellTag = 0;
for (var e of elements) {
  if (e.getElementsByClassName('image').length == 0) {
    continue;
  }
  name = e.getElementsByClassName('header -single')[0].innerText;
  img = name.replace(/ /g, '_');;
  elementTags = e.getElementsByTagName('a');
  tagstext = '';
  for (var tag of elementTags) {
    if (tag.innerText == '') {
      continue;
    }
    tagstext += '"' + tag.innerText.toUpperCase() + '",';
    if (tag.innerText.toUpperCase() == "BOW") {
      hasBowTag = 1;
    }
    if (tag.innerText.toUpperCase() == "MELEE") {
      hasMeleeTag = 1;
    }
    if (tag.innerText.toUpperCase() == "SPELL") {
      hasSpellTag = 1;
    }
  }
  if (hasSpellTag == 0) {
    if (hasBowTag == 1 && hasMeleeTag == 1) {
      tagstext += '"TWO-HANDED","ONE-HANDED","DUAL-WIELDING","AXE","SWORD","MACE","CLAW","DAGGER","STAFF","WAND","SCEPTRE",';
    } else if (hasMeleeTag == 1) {
      tagstext += '"TWO-HANDED","ONE-HANDED","DUAL-WIELDING","AXE","SWORD","MACE","CLAW","DAGGER","STAFF","SCEPTRE",';
    } else {
      if (hasBowTag == 0) {
        tagstext += '"TWO-HANDED","ONE-HANDED","DUAL-WIELDING","AXE","SWORD","MACE","CLAW","DAGGER","STAFF","WAND","BOW","SCEPTRE",';
      }
    }
  }
  hasSpellTag = 0;
  hasBowTag = 0;
  hasMeleeTag = 0;
  tagstext = tagstext.slice(0, -1);
  //console.log('{"name": "' + name + '", "image": "'+ img +'.png' + '", "tags": [' + tagstext + ']},');

  result += '{"name": "' + name + '", "image": "'+ img +'.png' + '", "tags": [' + tagstext + ']},';// + "/replace this with line break/";
}

console.log('{"skills":[' + result.slice(0, -1) + "]}");
