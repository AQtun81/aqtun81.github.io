// made for path of exile skill lister
// use at https://pathofexile.gamepedia.com/Skill_gem
// copy console output

result = '';

elements = document.getElementsByClassName('item-box -gem');
for (var e of elements) {
  img = e.getElementsByClassName('image');

  if (img.length == 0) {
    continue;
  }
  imgurl = img[0].children[0].src;
  console.log(imgurl);
  result += imgurl + '/replace this with line break/';
}
console.log(result);
