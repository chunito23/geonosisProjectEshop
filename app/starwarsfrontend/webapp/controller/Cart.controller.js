sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, JSONModel) => {
    "use strict";

    return BaseController.extend("starwarsfrontend.controller.Cart", {
        onInit() {
            const oRouter = this.getRouter();
            oRouter.getRoute("Cart").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            const userId = sessionStorage.getItem("userID");

            if (!userId) {
                MessageToast.show("Por favor, inicia sesión para ver tus favoritos");
                this.getRouter().navTo("start");
                return;
            }

            this._loadFavorites(userId);
            this._cartItems(userId);
        },

        _loadFavorites: function (userId) {
            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/getUserFavorites", {
                method: "POST",
                urlParameters: {
                    userId: userId
                },
                success: (oData) => {
                    console.log("Favoritos recibidos:", oData.results);

                    // Crear modelo JSON para la vista
                    const oFavoritesModel = new JSONModel(oData.results || []);
                    this.getView().setModel(oFavoritesModel, "favorites");


                },
                error: (err) => {
                    console.error("Error al cargar favoritos:", err);
                    MessageToast.show("Error al cargar favoritos");
                }
            });
        },

        _cartItems: function (userId) {
            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/getUserCart", {
                method: "POST",
                urlParameters: {
                    userId: userId
                },
                success: (oData) => {
                    console.log("Favoritos recibidos:", oData.results);

                    // Crear modelo JSON para la vista
                    const oCartItemsModel = new JSONModel(oData.results || []);
                    this.getView().setModel(oCartItemsModel, "cartItems");


                },
                error: (err) => {
                    console.error("Error al cargar favoritos:", err);
                    MessageToast.show("Error al cargar favoritos");
                }
            });
        },

        onDeleteCartItem: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("cartItems");
            const productId = oContext.getProperty("product").id;
            const userId = sessionStorage.getItem("userID");
            const OlistaCart = this.byId("cartItemsList")
            const OBinding =  OlistaCart.getBinding("items")

            // Depuración
            console.log(oContext)
            console.log("Frontend - userID:", userId);
            console.log("Frontend - productID:", productId);


            if (!userId || !productId) {
                MessageToast.show("Error: userID o productID no están definidos");
                return;
            }

            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/DeleteToCartItem", {
                method: "POST",
                urlParameters: {
                    userId: userId,
                    productId: productId
                },
                success: (oData) => {
                    console.log("Respuesta del backend:", oData);
                    MessageToast.show(oData.value || "eliminado");
                    this._cartItems(userId)
                },
                error: (err) => {
                    console.error("Error al eliminado:", err);
                    MessageToast.show("Error al eliminado");
                }
            });


        }

    });
});