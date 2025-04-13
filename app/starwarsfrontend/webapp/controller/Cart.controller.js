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
            //this._loadFavorites(userId);
            this._cartItems(userId);
        },

        _calcularSubTotal:function(array){
            let suma = 0
            array.results.forEach(element => {
                suma += parseFloat(element.product.price) * element.quantity
            });

            return suma 
        },

        _cartItems: function (userId) {
            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/getUserCart", {
                method: "POST",
                urlParameters: {
                    userId: userId
                },
                success: (oData) => {
                    console.log("carrito recibidos:", oData.results);

                    // Crear modelo JSON para la vista

                    const subTotal = this._calcularSubTotal(oData)
                    const impuestos = (subTotal * 0.21)
                    const precioFinal = (subTotal  + impuestos + 1000)
                    const CartModel = new JSONModel({
                        currency : "USD",
                        subtotal : subTotal.toFixed(2),
                        taxes : impuestos.toFixed(2),
                        shipping : 1000,
                        total : precioFinal.toFixed(2)
                    })
                    this.getView().setModel(CartModel, "cartModel");


                    
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
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("CategoryList")
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

            oModel.callFunction("/deleteToCartItem", {
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


        },

        //hacer si me da el tiempo
        onNavigateToProduct: function(){

        },

        onDecreaseQuantity: function(oEvent){
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

            oModel.callFunction("/decreaseToCartItem", {
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

        },

        onCheckout: function(){
            MessageToast.show("implementar despues")
        },

        onIncreaseQuantity: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("cartItems");
            console.log(oContext)
            const productID = oContext.getProperty("product").id;
            const userID = sessionStorage.getItem("userID");
          
            // Depuración
            console.log("Frontend - userID:", userID);
            console.log("Frontend - productID:", productID);
          
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
                this._cartItems(userID)
              },
              error: (err) => {
                console.error("Error al añadir al carrito:", err);
                MessageToast.show("Error al añadir al carrito");
              }
            });
          },

    });
});