# AI Workshop - S1 AI landscape, tools, risks, mindset 🛡️

Proyecto de desarrollo seguro asistido por IA para el IES Rafael Alberti. Esta sesión se centra en la creación de una API de utilidades robusta, validada y testeada.

## 🚀 Características y Módulos
El proyecto incluye dos micro-servicios integrados con lógica de validación avanzada:

1.  **QR Generator (`/qr`)**: 
    - Generación de códigos en Base64.
    - Límite de seguridad de 2000 caracteres para evitar sobrecarga del servidor.
2.  **Currency Converter (`/convert`)**:
    - Precisión financiera (redondeo a 2 decimales).
    - Validación de tipos numéricos y prevención de valores negativos.

## 🛡️ Estándares de Seguridad Aplicados
- **Input Validation**: Control estricto de parámetros `null`, `undefined` o vacíos.
- **Error Handling**: Bloques `try/catch` globales con respuestas JSON estandarizadas.
- **Security Limits**: Restricción de tamaño en los payloads para prevenir abusos de recursos.

## 🛠️ Instalación y Uso
1.  **Instalar dependencias**:
    ```bash
    npm install
    ```
2.  **Ejecutar Servidor**:
    ```bash
    npm start
    ```
    *El servidor corre por defecto en el puerto 3000.*
3.  **Ejecutar Tests**:
    ```bash
    npm test
    ```
    *Suite de pruebas con Mocha/Chai cubriendo Happy Paths y Error Cases.*

## 📑 Endpoints (API Spec)
| Método | Endpoint | Descripción | Parámetros |
| :--- | :--- | :--- | :--- |
| `POST` | `/qr` | Genera un código QR | `{ "text": "string" }` |
| `GET` | `/convert` | Conversor de divisas | `?from=USD&to=EUR&amount=100` |

## 🤖 Uso Ético de la IA
- **IA Utilizada**: Gemini 1.5 Pro / Flash.
- **Protocolo de Revisión**: Todo el código generado ha sido auditado línea a línea por un humano para garantizar la mantenibilidad y la seguridad (ver `RULES.md`).
- **Tests**: Generación de boilerplate de tests con IA, expandidos manualmente con casos de borde (edge cases).

---
*Sesión 1 — IES Rafael Alberti — Javier 2026*