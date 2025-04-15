sap.ui.define([
    "sap/ui/core/UIComponent",
    "starwarsfrontend/model/models",
    "sap/m/MessageBox",
    "sap/base/Log"
], (UIComponent, models, MessageBox, Log) => {
    "use strict";

    return UIComponent.extend("starwarsfrontend.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            var oRouter = this.getRouter();
            oRouter.attachRouteMatched(this._onAnyRouteMatched, this);

            // Modelo para controlar visibilidad en master menu
            const oViewModel = new sap.ui.model.json.JSONModel({
                mostrarSeccion: false
            });
            this.setModel(oViewModel, "viewModel");


           
            //sobreescribo el navto por que me da problemas para restringir rutas
            //esto deberia hacerlo desde el back enrealidad
            this._overrideNavTo(oRouter);

            //protejo rutas
            this._setupRouteProtection(oRouter);

    
            oRouter.initialize();
        },

        //esto es para que no se muestre las categorias y barra a menos que sea
        //la pagina de cateorias
        _onAnyRouteMatched: function (oEvent) {
            const sRouteName = oEvent.getParameter("name");
            const oViewModel = this.getModel("viewModel");

           
            const bMostrar = (sRouteName === "CategoryList"   || sRouteName === "CategoryFiltered" || sRouteName === "SubcategoryFiltered");
            console.log(bMostrar)
            oViewModel.setProperty("/mostrarSeccion", bMostrar);
        },

        _overrideNavTo: function (oRouter) {
            // Guardar referencia al método original navTo
            var fnOriginalNavTo = oRouter.navTo;
            var that = this;

            // Sobrescribir el método navTo
            oRouter.navTo = function (sRouteName, oParameters, bReplace) {
                Log.info("Navegando a ruta: " + sRouteName);

                // Si es ruta protegida, verificar autenticación
                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");

                    if (!userId) {
                        Log.warning("Intento de acceso sin autenticación a: " + sRouteName);
                        MessageBox.error("Debe iniciar sesión para acceder a esta página");
                        fnOriginalNavTo.call(this, "start", {}, true);
                        return;
                    }
                }

                // Si pasa verificación, permitir navegación
                fnOriginalNavTo.apply(this, arguments);
            };
        },

        _setupRouteProtection: function (oRouter) {
            // Proteger con eventos del router
            var that = this;

            // 1. Antes de que la ruta coincida (más temprano)
            oRouter.attachBeforeRouteMatched(function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                Log.info("beforeRouteMatched: " + sRouteName);

                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");
                    if (!userId) {
                        Log.warning("Bloqueando acceso por URL a: " + sRouteName);
                        oEvent.preventDefault();
                        MessageBox.error("Debe iniciar sesión para acceder a esta página");

                        // Importante: usar setTimeout para evitar problemas de timing
                        setTimeout(function () {
                            // Navegar a login usando el método original para evitar bucles
                            sap.m.routing.Router.prototype.navTo.call(oRouter, "start", {}, true);
                        }, 0);
                    }
                }
            });

            // 2. Cuando se encuentre una coincidencia de patrón (al inicio)
            oRouter.attachRoutePatternMatched(function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                Log.info("routePatternMatched: " + sRouteName);

                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");
                    if (!userId) {
                        Log.warning("Redirigiendo desde: " + sRouteName);
                        // Navegar a login de inmediato
                        oRouter.navTo("start", {}, true);
                    }
                }
            });

            // 3. Cuando la vista ya está cargada (último recurso)
            oRouter.attachRouteMatched(function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                Log.info("routeMatched: " + sRouteName);

                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");
                    if (!userId) {
                        Log.warning("Último intento de bloqueo: " + sRouteName);
                        // Navegar a login
                        oRouter.navTo("start", {}, true);
                    }
                }
            });
        },

        _isPublicRoute: function (sRouteName) {
            // Define aquí todas las rutas públicas que no requieren autenticación
            var aPublicRoutes = ["start", "CategoryList","SubcategoryFiltered","CategoryFiltered","productView"];
            return aPublicRoutes.indexOf(sRouteName) !== -1;
        }
    });
});