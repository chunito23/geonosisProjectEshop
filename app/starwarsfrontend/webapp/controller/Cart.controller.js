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
            const userId = sessionStorage.getItem("userID")
            this._LoadCartItems(userId);
        },

        _calcularSubTotal:function(array){
            let suma = 0
            array.results.forEach(element => {
                suma += parseFloat(element.product.price) * element.quantity
            });

            return suma 
        },

        _LoadCartItems: function (userId) {
            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/getUserCart", {
                method: "POST",
                urlParameters: {
                    userId: userId
                },
                success: (oData) => {
                    

                    // Creo modelo JSON para la vista

                    const subTotal = this._calcularSubTotal(oData)
                    const impuestos = (subTotal * 0.21)
                    const precioFinal = (subTotal  + impuestos + 1000)
                    const PriceModel = new JSONModel({
                        currency : "USD",
                        subtotal : subTotal.toFixed(2),
                        taxes : impuestos.toFixed(2),
                        shipping : 100, 
                        total : precioFinal.toFixed(2)
                    })
                    this.getView().setModel(PriceModel, "PriceModel");
                    const oCartItemsModel = new JSONModel(oData.results || []);
                    this.getView().setModel(oCartItemsModel, "cartItems");


                },
                error: (err) => {
                    console.error("Error al cargar favoritos:", err);
                    MessageToast.show("Error al cargar favoritos");
                }
            });
        },

        onContinueShopping: function(){
            const oRouter = this.getRouter();
            oRouter.navTo("CategoryList")
        },

        onDeleteCartItem: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("cartItems");
            const productId = oContext.getProperty("product").id;
            const userId = sessionStorage.getItem("userID");
   

            // comprobacion irrelevante por que no dejo entrar si no estas registrado
            //pensar en cambiar
            if (!userId || !productId) {
                MessageToast.show("Error: userID o productID no están definidos");
                return;
            }

            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/deleteToCartItem", {
                method: "POST",
                urlParameters: {
                    userId: userId,
                    productId: productId
                },
                success: (oData) => {
                    MessageToast.show(oData.value || "eliminado");
                    this._LoadCartItems(userId)
                },
                error: (err) => {
                    console.error("Error al eliminado:", err);
                    MessageToast.show("Error al eliminado");
                }
            });


        },

        //hacer si me da el tiempo navegar al productos desd el link
        onNavigateToProduct: function(oEvent){

        },

        onDecreaseQuantity: function(oEvent){
            const oContext = oEvent.getSource().getBindingContext("cartItems");
            const productId = oContext.getProperty("product").id;
            const userId = sessionStorage.getItem("userID");

            if (!userId || !productId) {
                MessageToast.show("Error: userID o productID no están definidos");
                return;
            }

            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/decreaseToCartItem", {
                method: "POST",
                urlParameters: {
                    userId: userId,
                    productId: productId
                },
                success: (oData) => {
                    MessageToast.show(oData.value || "eliminado");
                    this._LoadCartItems(userId)
                },
                error: (err) => {
                    console.error("Error al eliminado:", err);
                    MessageToast.show("Error al eliminado");
                }
            });

        },

        onCheckout: function(){
            const userId = sessionStorage.getItem("userID");

            if (!userId) {
                MessageToast.show("Error: userID ");
                return;
            }

            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/buyCart", {
                method: "POST",
                urlParameters: {
                    userId: userId,
                },
                success: (oData) => {
                    MessageToast.show(oData.value || "items comprados");
                    this._LoadCartItems(userId)
                },
                error: (err) => {
                    console.error("Error al comprar:", err);
                    MessageToast.show("Error al comprar");
                }
            });
        },

        onIncreaseQuantity: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("cartItems");
            const productID = oContext.getProperty("product").id;
            const userID = sessionStorage.getItem("userID");
          
          
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
                MessageToast.show(oData.value || "Producto añadido al carrito");
                this._LoadCartItems(userID)
              },
              error: (err) => {
                console.error("Error al añadir al carrito:", err);
                MessageToast.show("Error al añadir al carrito");
              }
            });
          },

    });
});