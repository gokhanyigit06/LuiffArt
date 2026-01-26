import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: 'app/api', // define api folder
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Luiff Art Admin API',
                version: '1.0',
                description: 'E-commerce Management API',
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                    },
                },
            },
            security: [],
        },
    });
    return spec;
};
