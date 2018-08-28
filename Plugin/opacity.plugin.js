//META{"name":"Opacity","website":"https://aqtun81.github.io/","source":"https://aqtun81.github.io/Plugin/opacity.plugin.js"}*//

function Opacity(){}

Opacity.prototype.getName = function () {
    return "Opacity";
};

Opacity.prototype.getDescription = function () {
    return "Creates fake opacity for transparent themes";
};

Opacity.prototype.getVersion = function () {
    return "0.1";
};

Opacity.prototype.getAuthor = function () {
    return "AQtun81";
};

Opacity.prototype.start = function () {
  window.opacityCustomStyle = document.createElement("STYLE");
  window.document.head.appendChild(opacityCustomStyle);
  var oldOpacityPosX = window.screenX,
      oldOpacityPosY = window.screenY;

	this.updateOpacityPos();
};

Opacity.prototype.updateOpacityPos = function() {
      window.opacityInterval = setInterval(this.updateOpacityPos, 250);
      if (window.screenX == this.oldOpacityPosX || window.screenY == this.oldOpacityPosY) {
        return;
      }
      this.oldOpacityPosX = window.screenX;
      this.oldOpacityPosY = window.screenY;

      console.log("x: " + this.oldOpacityPosX + ", y: " + this.oldOpacityPosY);

      window.opacityCustomStyle.innerText = "body::after {background-size: 1920px 1080px;background-position-y: -" + window.screenY + "px;background-position-x: -" + window.screenX +"px;top: 0;left: 0;right: 0;bottom: 0;}";
    }

Opacity.prototype.load = function() {};
Opacity.prototype.unload = function() {};
Opacity.prototype.stop = function() {
  window.opacityCustomStyle.parentNode.removeChild(opacityCustomStyle);
  clearInterval(window.opacityInterval);
  clearInterval(opacityInterval);
};
Opacity.prototype.onSwitch = function() {};
Opacity.prototype.getSettingsPanel = function() {};
