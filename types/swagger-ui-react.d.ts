declare module 'swagger-ui-react' {
    import React from 'react';

    export interface SwaggerUIProps {
        url?: string;
        spec?: object;
    }

    const SwaggerUI: React.FC<SwaggerUIProps>;
    export default SwaggerUI;
}
