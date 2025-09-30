// src/app/environments/environment.development.ts
export const environment = {
    production: false,
    
    // API Configuration
    apiUrl: 'https://apirematestest.tiarica.cl/api',
    
    // Clave Única Configuration
    clientIdClaveUnica: '12f1aa2c813b4fed97212f76475b48ba',
    redirecUriClaveUnica: 'https://adminrematestest.tiarica.cl', // Agregar /callback
    uriLogoutClaveUnica: 'adminrematestest.tiarica.cl',
    
    // Feature Flags
    enableMockData: true, // Para desarrollo con datos simulados
    enableDebugMode: true,
    
    // Upload Configuration
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['.xlsx', '.xls'],
    
    // Pagination
    defaultPageSize: 10,
    maxPageSize: 100
};