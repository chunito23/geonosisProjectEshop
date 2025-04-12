sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("starwarsfrontend.controller.App", {
    onInit() {
      const texto = this.byId("textoUsuario")
      const savedUserId = sessionStorage.getItem("userID");

      texto.setText(savedUserId)



    }
  });
});