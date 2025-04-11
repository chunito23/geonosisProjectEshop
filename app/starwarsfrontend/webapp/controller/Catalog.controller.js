sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
  ], function (BaseController, MessageToast) {
    "use strict";
  
    return BaseController.extend("starwarsfrontend.controller.Catalog", {
      onInit: function () {
        const oRouter = this.getRouter();
      
        oRouter.getRoute("CategoryList").attachPatternMatched(this._onRouteMatched, this);
        oRouter.getRoute("CategoryFiltered").attachPatternMatched(this._onRouteMatched, this);
        oRouter.getRoute("SubcategoryFiltered").attachPatternMatched(this._onRouteMatched, this);
      },
      
      _onRouteMatched: function (oEvent) {
        const args = oEvent.getParameter("arguments");
        const categoryId = args.categoryId;
        const subCategoryId = args.subCategoryId;
      
        const oView = this.getView();
        const oList = oView.byId("categoryList"); // id que ahora te paso
      
        const oBinding = oList.getBinding("items");
        if (!oBinding) return;
      
        if (categoryId && subCategoryId) {
          // Filtrar categoría y subcategoría
          oBinding.filter([
            new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, categoryId),
            new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, subCategoryId)
          ]);
        } else if (categoryId) {
          // Filtrar solo categoría
          oBinding.filter([
            new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, categoryId)
          ]);
        } else {
          // Mostrar todas las categorías
          oBinding.filter([]);
        }
      },
  
      onProductCardPress: function (oEvent) {
        const oContext = oEvent.getSource().getBindingContext();
        const ProductId = oContext.getProperty("id");
        MessageToast.show(`Ver detalles de "${ProductId}"`);
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
  