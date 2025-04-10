sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
  ], function (Controller, MessageToast) {
    "use strict";
  
    return Controller.extend("starwarsfrontend.controller.Catalog", {
  
      onProductCardPress: function (oEvent) {
        const oContext = oEvent.getSource().getBindingContext();
        const productName = oContext.getProperty("name");
        MessageToast.show(`Ver detalles de "${productName}"`);
        // Podés navegar a una vista de detalles usando el router acá
      },
  
      onAddToCart: function (oEvent) {
        const oContext = oEvent.getSource().getParent().getParent().getBindingContext();
        const productName = oContext.getProperty("name");
        MessageToast.show(`"${productName}" añadido al carrito`);
        // Implementar lógica de acción OData / llamada al backend
      },
  
      onBuyNow: function (oEvent) {
        const oContext = oEvent.getSource().getParent().getParent().getBindingContext();
        const productName = oContext.getProperty("name");
        MessageToast.show(`Comprando "${productName}" ahora`);
        // Podés lanzar el flujo de checkout directamente
      }
  
    });
  });
  