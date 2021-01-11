// made for path of exile skill lister
// use at https://pathofexile.gamepedia.com/Skill_gem
// copy console output

result = '';

elements = document.getElementsByClassName('item-box -gem');
for (var e of elements) {
  if (e.getElementsByClassName('image').length == 0) {
    continue;
  }
  name = e.getElementsByClassName('header -single')[0].childNodes[1].nodeValue;
  img = name.replace(/ /g, '_');;
  elementTags = e.getElementsByTagName('a');
  tagstext = '';
  for (var tag of elementTags) {
    if (tag.textContent == '') {
      continue;
    }
    tagstext += '"' + tag.textContent.toUpperCase() + '",';
  }
  tagstext = tagstext.slice(0, -1);
  //console.log('{"name": "' + name + '", "image": "'+ img +'.png' + '", "tags": [' + tagstext + ']},');

  result += '{"name": "' + name + '", "image": "'+ img +'.png' + '", "tags": [' + tagstext + ']},';// + "/replace this with line break/";
}

console.log('{"skills":[' + result.slice(0, -1) + "]}");
