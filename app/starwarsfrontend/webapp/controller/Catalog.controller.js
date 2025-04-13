sap.ui.define([
  "./BaseController",
  "sap/m/MessageToast",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, Filter, FilterOperator) {
  "use strict";

  return BaseController.extend("starwarsfrontend.controller.Catalog", {
    onInit: function () {
      // Configurar el router
      const oRouter = this.getRouter();
      oRouter.getRoute("CategoryList").attachPatternMatched(this._onCategoryRouteMatched, this);
      oRouter.getRoute("CategoryFiltered").attachPatternMatched(this._onCategoryRouteMatched, this);
      oRouter.getRoute("SubcategoryFiltered").attachPatternMatched(this._onSubcategoryRouteMatched, this);
      this.oEventBus = sap.ui.getCore().getEventBus()
      this.oEventBus.subscribe("masterChanel","SearchRequest",this.onSearchRequested,this)
    },

    onSearchRequested: function(sChannel, sEvent, oData) {
      var sQuery = oData.searchQuery;
      var oTable = this.byId("productsContainer"); // Reemplaza por el ID de tu tabla
      var oBinding = oTable.getBinding("items");
      
      if (sQuery && sQuery.length > 0) {
          // Crea un filtro para buscar en el nombre del producto (ajusta según tu modelo)
          var aFilters = [
              new Filter("name", FilterOperator.Contains, sQuery)
          ];
          oBinding.filter(aFilters);
      } else {
          // Si no hay query, quita todos los filtros
          oBinding.filter([]);
      }
      
  },
    
    _onCategoryRouteMatched: function (oEvent) {
      const args = oEvent.getParameter("arguments");
      const categoryId = args.categoryId;
      
      // Si no hay categoría, mostramos todos los productos
      if (!categoryId) {
        this._applyFilters([]);
        return;
      }
      
      // Filtrar productos por categoría
      const oCategoryFilter = new Filter("subcategory/category_id", FilterOperator.EQ, categoryId);
      this._applyFilters([oCategoryFilter]);
    },
    
    _onSubcategoryRouteMatched: function (oEvent) {
      const args = oEvent.getParameter("arguments");
      const subCategoryId = args.subCategoryId;
      
      // Filtrar productos por subcategoría
      const oSubcategoryFilter = new Filter("subcategory_id", FilterOperator.EQ, subCategoryId);
      this._applyFilters([oSubcategoryFilter]);
    },
    
    _applyFilters: function(aFilters) {
      // Obtener el binding de la lista de productos
      const oProductsContainer = this.byId("productsContainer");
      const oBinding = oProductsContainer.getBinding("items");
      
      // Aplicar filtros
      if (oBinding) {
        oBinding.filter(aFilters);
      }
    },

    onProductCardPress: function (oEvent) {
      const oContext = oEvent.getSource().getBindingContext();
      const productId = oContext.getProperty("id");
      const categoryId = oContext.getProperty("subcategory/category_id");
      const subCategoryId = oContext.getProperty("subcategory_id");
      
      // Navegar a la vista de detalles de producto
      this.getRouter().navTo("productView", {
        categoryId,
        subCategoryId,
        productId
      });
    },

    onAddToCart: function (oEvent) {
      const oContext = oEvent.getSource().getBindingContext();
      const productID = oContext.getProperty("id");
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
    
      // Depuración
      console.log("Frontend - userID:", userID);
      console.log("Frontend - productID:", productID);
    
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
    },

    
      
    
    onViewCart: function() {
      // Navegar a la vista del carrito (definir esta ruta en manifest.json)
      this.getRouter().navTo("Cart");
    }
  });
});