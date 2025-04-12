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
      const oContext = oEvent.getSource().getParent().getParent().getBindingContext();
      const productName = oContext.getProperty("name");
      MessageToast.show(`"${productName}" añadido al carrito`);
      
      // Aquí implementarías la lógica para añadir al carrito
    },

    onBuyNow: function (oEvent) {
      const oContext = oEvent.getSource().getParent().getParent().getBindingContext();
      const productName = oContext.getProperty("name");
      MessageToast.show(`Comprando "${productName}" ahora`);
      
      // Aquí implementarías la lógica para comprar ahora
    },
    
    onViewCart: function() {
      // Navegar a la vista del carrito (definir esta ruta en manifest.json)
      this.getRouter().navTo("Cart");
    }
  });
});