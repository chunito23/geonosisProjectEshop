sap.ui.define([
  "./BaseController",
  "sap/ui/core/routing/History",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (BaseController, History, MessageToast, MessageBox) {
  "use strict";

  return BaseController.extend("starwarsfrontend.controller.ProductDetail", {
    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("productView").attachPatternMatched(this._onProductMatched, this);
    },

    _onProductMatched: function (oEvent) {
      var sProductId = oEvent.getParameter("arguments").productId;

      this.getView().bindElement({
        path: "/Products(" + sProductId + ")",
        parameters : {
          expand: "details,tags,variants"
        }
      });
    },

  });
});