sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], (Controller, MessageToast) => {
  "use strict";

  return Controller.extend("starwarsfrontend.controller.Main", {
    onInit: function () {

    },

    getRouter: function () {
      return this.getOwnerComponent().getRouter();
    },


    onRegister: function () {
      const email = this.byId("emailInput").getValue();
      const password = this.byId("passwordInput").getValue();

      const oModel = this.getOwnerComponent().getModel();

      oModel.callFunction("/register", {
        method: "POST",
        urlParameters: { email, password },
        success: (data) => {
          if (data.register.success) {
            // Guardar el ID del usuario y navegación como en login
            const userID = data.register.userID;

            const userModel = new sap.ui.model.json.JSONModel({
              userID: userID,
              isLoggedIn: true
            });

            this.getOwnerComponent().setModel(userModel, "userInfo");

            // Navegar a la página principal
            this.getRouter().navTo("User");
          } else {
            this.byId("statusText").setText("El usuario ya existe");
          }
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
          if (data.login.success) {
            // Guardar el ID del usuario en el modelo local o en sessionStorage
            const userID = data.login.userID;

            // Crear un modelo local para el usuario
            const userModel = new sap.ui.model.json.JSONModel({
              userID: userID,
              isLoggedIn: true
            });

            this.getOwnerComponent().setModel(userModel, "userInfo");

            // Navegar a la página principal
            this.getRouter().navTo("User");
          } else {
            this.byId("statusText").setText("Credenciales incorrectas");
          }
        },
        error: (err) => {
          sap.m.MessageToast.show("Error de inicio de sesión");
          console.error(err);
        }
      });
    }


  });
});