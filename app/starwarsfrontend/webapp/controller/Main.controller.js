sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";

    return Controller.extend("starwarsfrontend.controller.Main", {
        onInit: function () {

          },

          onRegister: function () {
            const email = this.byId("emailInput").getValue();
            const password = this.byId("passwordInput").getValue();
          
            const oModel = this.getOwnerComponent().getModel();
          
            oModel.callFunction("/register", {
              method: "POST",
              urlParameters: { email, password },
              success: (data) => {
                console.log(data)
                const success = data.register;
                this.byId("statusText").setText(success ? "Registro exitoso" : "El usuario ya existe");
              },
              error: (err) => {
                sap.m.MessageToast.show("Error en registro");
                console.error(err);
              }
            });
          },

          onLogin: function () {
            const email = this.byId("emailInput").getValue();
            const password = this.byId("passwordInput").getValue();
          
            const oModel = this.getOwnerComponent().getModel();
          
            oModel.callFunction("/login", {
              method: "POST",
              urlParameters: { email, password },
              success: (data) => {
                console.log("login ", data)
                const success = data.login;
                this.byId("statusText").setText(success ? "login exitoso" : "error en el login");
              },
              error: (err) => {
                sap.m.MessageToast.show("Error en login");
                console.error(err);
              }
            });
          }
        });
});