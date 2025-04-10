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
        oRouter.getRoute("productDetail").attachPatternMatched(this._onProductMatched, this);
      },
  
      _onProductMatched: function(oEvent) {
        var sProductId = oEvent.getParameter("arguments").productId;
        
        // Ajustar el contexto del modelo para mostrar los datos del producto
        var sPath = "/Products('" + sProductId + "')";
        this.getView().bindElement({
          path: sPath,
          parameters: {
            expand: "details,tags,variants"
          }
        });
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
  
      onAddToCart: function() {
        // Obtener datos del producto actual
        var oProductContext = this.getView().getBindingContext();
        var oProduct = oProductContext.getObject();
        
        // Obtener la variante seleccionada, si hay alguna
        var oVariantSelector = this.byId("variantSelector");
        var sVariantId = oVariantSelector && oVariantSelector.getSelectedKey();
        
        // Preparar datos para añadir al carrito
        var oCartData = {
          product: oProduct.id,
          variant: sVariantId || null,
          quantity: 1
        };
        
        // Llamar al servicio para añadir al carrito
        var oModel = this.getOwnerComponent().getModel();
        oModel.create("/CartItems", oCartData, {
          success: function() {
            MessageToast.show("Producto añadido al carrito");
          },
          error: function(oError) {
            MessageBox.error("Error al añadir al carrito: " + oError.message);
          }
        });
      },
  
      onBuyNow: function() {
        // Primero añadimos al carrito
        this.onAddToCart();
        
        // Luego navegamos al checkout
        this.getOwnerComponent().getRouter().navTo("checkout");
      },
  
      onVariantChange: function(oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (!oSelectedItem) return;
        
        // Obtener los datos de la variante seleccionada
        var sVariantKey = oSelectedItem.getKey();
        var oProductContext = this.getView().getBindingContext();
        var aVariants = oProductContext.getObject().variants;
        
        // Encontrar la variante seleccionada
        var oSelectedVariant = aVariants.find(function(v) {
          return v.variantId === sVariantKey;
        });
        
        if (oSelectedVariant) {
          // Actualizar precio y stock según la variante
          var oPriceElement = this.byId("productPrice");
          if (oPriceElement) {
            oPriceElement.setNumber(oSelectedVariant.price);
          }
          
          // Actualizar estado de stock
          var oStockElement = this.byId("stockStatus");
          if (oStockElement) {
            oStockElement.setText(oSelectedVariant.stock > 0 ? "Disponible" : "Agotado");
            oStockElement.setState(oSelectedVariant.stock > 0 ? "Success" : "Error");
          }
          
          // Actualizar botones según disponibilidad
          var bHasStock = oSelectedVariant.stock > 0;
          this.byId("addToCartBtn").setEnabled(bHasStock);
          this.byId("buyNowBtn").setEnabled(bHasStock);
        }
      },
  
      onRelatedProductPress: function(oEvent) {
        // Obtener el contexto del producto relacionado
        var oContext = oEvent.getSource().getBindingContext();
        var sProductId = oContext.getObject().id;
        
        // Navegar al detalle de ese producto
        this.getOwnerComponent().getRouter().navTo("productDetail", {
          productId: sProductId
        });
      },
  
      onShareProduct: function() {
        var oProduct = this.getView().getBindingContext().getObject();
        
        // Construir el texto para compartir
        var sShareText = "¡Mira este producto! " + oProduct.name + " - " + oProduct.price + " " + oProduct.currency;
        
        // Usar el servicio de compartir del navegador si está disponible
        if (navigator.share) {
          navigator.share({
            title: oProduct.name,
            text: sShareText,
            url: window.location.href
          }).catch(function(error) {
            MessageToast.show("Error al compartir: " + error);
          });
        } else {
          // Alternativa: copiar al portapapeles
          navigator.clipboard.writeText(sShareText + " " + window.location.href).then(function() {
            MessageToast.show("Enlace copiado al portapapeles");
          }).catch(function() {
            MessageToast.show("No se pudo copiar al portapapeles");
          });
        }
      },
  
      onViewCart: function() {
        this.getOwnerComponent().getRouter().navTo("cart");
      }
    });
  });