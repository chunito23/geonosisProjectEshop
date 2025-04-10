sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("starwarsfrontend.controller.Main", {
        onInit: function () {
            // View model para datos de entrada/salida
            const oViewModel = new sap.ui.model.json.JSONModel({
              name: "",
              greeting: ""
            });
            this.getView().setModel(oViewModel);
          },
      
          onGreet: function () {
            const oModel = this.getOwnerComponent().getModel(); // ODataModel V2
            const sName = this.getView().getModel().getProperty("/name");
            const that = this;
      
            oModel.callFunction("/greet", {
              method: "POST",
              urlParameters: {
                name: "chuno"
              },
              success: function (oData) {
                console.log("odata ", oData)
                console.log("odataValue", oData.greet)
                that.getView().getModel().setProperty("/greeting", oData.greet);
              },
              error: function (err) {
                console.error("Error al llamar greet:", err);
              }
            });
          }
        });
});