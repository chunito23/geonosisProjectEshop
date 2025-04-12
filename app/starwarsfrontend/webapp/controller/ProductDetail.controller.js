sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
  ], function(Controller, History, MessageToast, MessageBox) {
    "use strict";
  
    return Controller.extend("starwarsfrontend.controller.ProductDetail", {
      onInit: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("productView").attachPatternMatched(this._onProductMatched, this);
      },
  
      _onProductMatched: function(oEvent) {
       
      },
  
      onNavBack: function() {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();
  
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getOwnerComponent().getRouter().navTo("catalog", {}, true);
        }
      },
  
      
    });
  });