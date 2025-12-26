#!/bin/bash

# Script de despliegue para Azure App Service
# LimpiApp Backend API - Node.js/Express/TypeScript

set -e  # Salir en caso de error

# Variables de configuración
RESOURCE_GROUP="ragia-rg"
LOCATION="eastus"
ACR_NAME="aludradev"  # ACR existente
APP_SERVICE_PLAN="ragia-plan"
APP_SERVICE_NAME="limpiapp-api"  # Nombre único
IMAGE_NAME="limpiapp-api"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando despliegue de LimpiApp API en Azure App Service${NC}"
echo -e "${YELLOW}Configuración:${NC}"
echo "  - Resource Group: $RESOURCE_GROUP"
echo "  - Location: $LOCATION"
echo "  - Container Registry: $ACR_NAME"
echo "  - App Service Plan: $APP_SERVICE_PLAN"
echo "  - App Service: $APP_SERVICE_NAME"
echo ""

# Verificar que Azure CLI esté instalado e iniciado sesión
echo -e "${BLUE}🔍 Verificando Azure CLI...${NC}"
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI no está instalado. Instálalo desde: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli${NC}"
    exit 1
fi

# Verificar sesión
az account show &> /dev/null || {
    echo -e "${YELLOW}⚠️  No has iniciado sesión en Azure. Ejecuta: az login${NC}"
    exit 1
}

echo -e "${GREEN}✅ Azure CLI configurado correctamente${NC}"

# Verificar que existe archivo .env para cargar variables
ENV_FILE=".env.production"
if [ ! -f "$ENV_FILE" ]; then
    ENV_FILE=".env"
fi

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ No se encontró .env.production ni .env. Crea uno de estos archivos.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Usando archivo de entorno: $ENV_FILE${NC}"

# Cargar variables de entorno
set -a
source "$ENV_FILE"
set +a

# Paso 1: Crear Resource Group (si no existe)
echo -e "${BLUE}📦 Verificando/Creando Resource Group: $RESOURCE_GROUP${NC}"
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --output table 2>/dev/null || true

# Paso 2: Verificar ACR existente
echo -e "${BLUE}🔍 Verificando Azure Container Registry existente: $ACR_NAME${NC}"
if ! az acr show --name $ACR_NAME --output none 2>/dev/null; then
    echo -e "${RED}❌ El Container Registry $ACR_NAME no existe o no tienes acceso.${NC}"
    echo -e "${YELLOW}💡 Asegúrate de que el ACR existe y tienes permisos.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Container Registry $ACR_NAME encontrado${NC}"

# Paso 3: Construir y subir imagen Docker
echo -e "${BLUE}🔨 Construyendo imagen Docker para Linux AMD64...${NC}"

docker build --platform linux/amd64 \
    -t $IMAGE_NAME .

echo -e "${BLUE}🏷️  Etiquetando imagen para ACR...${NC}"
docker tag $IMAGE_NAME $ACR_NAME.azurecr.io/$IMAGE_NAME:latest

echo -e "${BLUE}🔐 Iniciando sesión en ACR...${NC}"
az acr login --name $ACR_NAME

echo -e "${BLUE}⬆️  Subiendo imagen a ACR...${NC}"
docker push $ACR_NAME.azurecr.io/$IMAGE_NAME:latest

# Paso 4: Crear App Service Plan (si no existe)
echo -e "${BLUE}📋 Creando/Verificando App Service Plan: $APP_SERVICE_PLAN${NC}"
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --is-linux \
    --sku B1 \
    --output table 2>/dev/null || true

# Paso 5: Obtener credenciales del ACR existente
echo -e "${BLUE}🔑 Obteniendo credenciales del Container Registry...${NC}"
ACR_SERVER=$(az acr show --name $ACR_NAME --query "loginServer" --output tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query "username" --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" --output tsv)

# Paso 6: Crear App Service (si no existe)
echo -e "${BLUE}🚀 Creando/Actualizando App Service: $APP_SERVICE_NAME${NC}"

# Verificar si el App Service existe
if az webapp show --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo -e "${YELLOW}App Service ya existe, actualizando...${NC}"
else
    az webapp create \
        --resource-group $RESOURCE_GROUP \
        --plan $APP_SERVICE_PLAN \
        --name $APP_SERVICE_NAME \
        --deployment-container-image-name $ACR_SERVER/$IMAGE_NAME:latest \
        --output table
fi

# Paso 7: Configurar credenciales del Container Registry
echo -e "${BLUE}🔐 Configurando credenciales del Container Registry...${NC}"
az webapp config container set \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP \
    --container-image-name $ACR_SERVER/$IMAGE_NAME:latest \
    --container-registry-url https://$ACR_SERVER \
    --container-registry-user $ACR_USERNAME \
    --container-registry-password $ACR_PASSWORD

# Paso 8: Configurar variables de entorno para Node.js
echo -e "${BLUE}⚙️  Configurando variables de entorno...${NC}"
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_SERVICE_NAME \
    --settings \
        NODE_ENV="production" \
        WEBSITES_PORT="3000" \
        PORT="3000" \
        API_VERSION="${API_VERSION:-v1}" \
        DATABASE_URL="$DATABASE_URL" \
        JWT_SECRET="$JWT_SECRET" \
        JWT_EXPIRES_IN="${JWT_EXPIRES_IN:-1h}" \
        JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
        JWT_REFRESH_EXPIRES_IN="${JWT_REFRESH_EXPIRES_IN:-7d}" \
        STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
        STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLISHABLE_KEY" \
        STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET" \
        TWILIO_ACCOUNT_SID="$TWILIO_ACCOUNT_SID" \
        TWILIO_AUTH_TOKEN="$TWILIO_AUTH_TOKEN" \
        TWILIO_PHONE_NUMBER="$TWILIO_PHONE_NUMBER" \
        SENDGRID_API_KEY="$SENDGRID_API_KEY" \
        SENDGRID_FROM_EMAIL="$SENDGRID_FROM_EMAIL" \
        AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
        AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
        AWS_REGION="${AWS_REGION:-us-east-1}" \
        AWS_S3_BUCKET="$AWS_S3_BUCKET" \
        GOOGLE_MAPS_API_KEY="$GOOGLE_MAPS_API_KEY" \
        CORS_ORIGIN="$CORS_ORIGIN" \
        LOG_LEVEL="${LOG_LEVEL:-info}" \
        CLIENT_APP_URL="$CLIENT_APP_URL" \
        ADMIN_PANEL_URL="$ADMIN_PANEL_URL" \
    --output table

# Paso 9: Habilitar logging
echo -e "${BLUE}📝 Habilitando logs de la aplicación...${NC}"
az webapp log config \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP \
    --docker-container-logging filesystem \
    --output table

# Paso 10: Obtener la URL de la aplicación
echo -e "${BLUE}🌐 Obteniendo URL de la aplicación...${NC}"
APP_URL=$(az webapp show \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "defaultHostName" \
    --output tsv)

# Paso 11: Reiniciar App Service para aplicar cambios
echo -e "${BLUE}🔄 Reiniciando App Service...${NC}"
az webapp restart \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP

echo ""
echo -e "${GREEN}🎉 ¡Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}✅ Aplicación disponible en: https://$APP_URL${NC}"
echo ""
echo -e "${YELLOW}📋 Información del despliegue:${NC}"
echo "  - Resource Group: $RESOURCE_GROUP"
echo "  - Container Registry: $ACR_NAME.azurecr.io"
echo "  - App Service Plan: $APP_SERVICE_PLAN"
echo "  - App Service: $APP_SERVICE_NAME"
echo "  - URL de la aplicación: https://$APP_URL"
echo "  - Puerto: 3000"
echo ""
echo -e "${BLUE}🔧 Comandos útiles:${NC}"
echo "  - Ver logs: az webapp log tail --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "  - Ver detalles: az webapp show --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "  - SSH al container: az webapp ssh --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "  - Eliminar recursos: az group delete --name $RESOURCE_GROUP --yes --no-wait"
echo ""
echo -e "${YELLOW}⚠️  Importante:${NC}"
echo "  - Verifica los logs para asegurarte que la app inició correctamente"
echo "  - Health check: https://$APP_URL/health"
echo "  - La primera vez puede tomar 1-2 minutos en iniciar"
echo ""
