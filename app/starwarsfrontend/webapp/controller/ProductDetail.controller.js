sap.ui.define([
  "./BaseController",
  "sap/m/MessageToast",
], function (BaseController, MessageToast) {
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
        parameters: {
          expand: "details,tags,variants"
        }
      });
    },

    onComprarUno: function (oEvent) {
      console.log("hola")
      const octx = oEvent.getSource().getBindingContext()
      const productId = octx.getProperty("id")
      const userId = sessionStorage.getItem("userID");

      if (!userId) {
        MessageToast.show("logeate");
        return;
      }

      const oModel = this.getOwnerComponent().getModel();

      oModel.callFunction("/BuyOneItem", {
        method: "POST",
        urlParameters: {
          userId: userId,
          productId: productId
        },
        success: (oData) => {
          const oBinding = this.getView().getElementBinding();
          if (oBinding) {
            oBinding.refresh(true); // 'true' para forzar el reload desde el backend
          }
          MessageToast.show(oData.value || "item comprados");
        },
        error: (err) => {
          console.error("Error al comprar:", err);
          MessageToast.show("Error al comprar");
        }
      });

    },

    onAddToCart: function (oEvent) {
      const oContext = oEvent.getSource().getBindingContext();
      const productID = oContext.getProperty("id");
      const userID = sessionStorage.getItem("userID");
      if (!userID) {
        MessageToast.show("debe logearse para comprar")
        return;
      }

      if (!userID || !productID) {
        MessageToast.show("Error: userID o productID no están definidos");
        return;
      }

      const oModel = this.getOwnerComponent().getModel();

      oModel.callFunction("/addToCartItem", {
        method: "POST",
        urlParameters: {
          userId: userID,
          productId: productID
        },
        success: (oData) => {
          console.log("Respuesta del backend:", oData);
          MessageToast.show(oData.value || "Producto añadido al carrito");
        },
        error: (err) => {
          console.error("Error al añadir al carrito:", err);
          MessageToast.show("Error al añadir al carrito");
        }
      });
    },

    onAddFavorite: function (oEvent) {
      const oContext = oEvent.getSource().getBindingContext();
      const productID = oContext.getProperty("id");
      const userID = sessionStorage.getItem("userID");

      if (!userID) {
        MessageToast.show("Debe logearse para agregar a favoritos")
        return;
      }


      if (!userID || !productID) {
        MessageToast.show("Error: userID o productID no están definidos");
        return;
      }

      const oModel = this.getOwnerComponent().getModel();

      oModel.callFunction("/addFavorite", {
        method: "POST",
        urlParameters: {
          userId: userID,
          productId: productID
        },
        success: (oData) => {
          console.log("Respuesta del backend:", oData);
          MessageToast.show(oData.value || "Producto añadido a favoritos");
        },
        error: (err) => {
          console.error("Error al añadir favorito:", err);
          MessageToast.show("Error al añadir a favoritos");
        }
      });
    }

  });
});