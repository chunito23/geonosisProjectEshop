// BaseController.js
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, History, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("starwarsfrontend.controller.BaseController", {

    getRouter: function () {
      return this.getOwnerComponent().getRouter();
    },

    getModel: function (sName) {
      return this.getView().getModel(sName);
    },

    setModel: function (oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    getResourceBundle: function () {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    onNavBack: function () {
      const oHistory = History.getInstance();
      const sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        
        this.getRouter().navTo("CategoryList", {}, true);
      }
    },

    showMessage: function (sText) {
      MessageToast.show(sText);
    },

    showError: function (sText) {
      MessageBox.error(sText);
    },

    showSuccess: function (sText) {
      MessageBox.success(sText);
    },

    //esta no creo usarla
    showConfirm: function (sText, fnCallback) {
      MessageBox.confirm(sText, {
        onClose: fnCallback
      });
    }

  });
});