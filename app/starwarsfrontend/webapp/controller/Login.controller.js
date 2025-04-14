sap.ui.define([
  "./BaseController",
  "sap/m/MessageToast"
], (BaseController, MessageToast) => {
  "use strict";

  return BaseController.extend("starwarsfrontend.controller.Login", {
    onInit: function () { //el onit solo anda al principio
      const oRouter = this.getRouter()
      oRouter.getRoute("start").attachPatternMatched(this._onCategoryRouteMatched, this);

    },

    _onCategoryRouteMatched: function(){
      // cada vez que llegas a la ruta login deslogearse
      sessionStorage.removeItem("userID")
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

            sessionStorage.setItem("userID", userID);

            this.getOwnerComponent().setModel(userModel, "userInfo");

            // Navegar a la página principal
            this.getRouter().navTo("CategoryList");
          } else {
            MessageToast.show("el usuario ya existe");
          }
        },
        error: (err) => {
          MessageToast.show("Error en registro");
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

            sessionStorage.setItem("userID", userID);

            // Navegar a la página principal
            this.getRouter().navTo("CategoryList");
          } else {
            MessageToast.show("credenciales incorrectas");
          }
        },
        error: (err) => {
          MessageToast.show("Error de inicio de sesión");
          console.error(err);
        }
      });
    },

    onNavBack:function(){
      
    }


  });
});