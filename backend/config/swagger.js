import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Tài liệu API cho dự án ReBev',
        },
        servers: [
            {
                url: process.env.BASE_URL,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // Output-only schemas based on models
                User: {
                    type: 'object',
                    description: 'Người dùng (output)',
                    properties: {
                        id: { type: 'integer' },
                        display_name: { type: 'string' },
                        phone: { type: 'string' },
                        role: { type: 'integer', description: '0=member,1=staff,2=admin' },
                        avatar: { type: 'string', nullable: true },
                        package_id: { type: ['integer', 'null'], nullable: true },
                        package_start: {
                            type: ['string', 'null'],
                            format: 'date-time',
                            nullable: true,
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                MediaFile: {
                    type: 'object',
                    description: 'Tệp media của bài đăng',
                    properties: {
                        url: { type: 'string', format: 'uri' },
                        is_thumbnail: { type: 'boolean' },
                    },
                },
                PostDetail: {
                    type: 'object',
                    description: 'Chi tiết bài đăng (variation/values)',
                    properties: {
                        id: { type: 'integer' },
                        variation_id: { type: 'integer' },
                        variation_value_id: { type: ['integer', 'null'], nullable: true },
                        custom_value: { type: ['string', 'null'], nullable: true },
                    },
                },
                Post: {
                    type: 'object',
                    description: 'Bài đăng (output)',
                    properties: {
                        id: { type: 'integer' },
                        user_id: { type: 'integer' },
                        category_id: { type: 'integer' },
                        title: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        price: { type: 'number' },
                        base_id: { type: ['integer', 'null'], nullable: true },
                        seller_contact_id: { type: 'integer' },
                        status: { type: 'integer', description: 'Trạng thái xử lý nội bộ' },
                        mediaFiles: {
                            type: 'string',
                        },
                        details: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/PostDetail' },
                        },
                        is_deleted: { type: 'boolean' },
                        is_hidden: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Category: {
                    type: 'object',
                    description: 'Danh mục sản phẩm',
                    properties: {
                        id: { type: 'integer', example: 2 },
                        name: { type: 'string', example: 'Pin xe máy điện' },
                        is_deposit: { type: 'boolean', example: false },
                        deposit_rate: { type: 'number', example: 0 },
                        commission_rate: { type: 'number', example: 5 },
                    },
                },
                Base: {
                    type: 'object',
                    description: 'Thông tin liên hệ trụ sở kiểm định',
                    properties: {
                        id: { type: 'integer', example: 5 },
                        detail: { type: 'string', example: 'Khu công nghiệp Hiệp Phước' },
                        ward_code: { type: 'string', example: '22302' },
                        ward_name: { type: 'string', example: 'Xã Hiệp Phước' },
                        district_id: { type: 'integer', example: 1534 },
                        district_name: { type: 'string', example: 'Huyện Nhà Bè' },
                        province_id: { type: 'integer', example: 202 },
                        province_name: { type: 'string', example: 'Hồ Chí Minh' },
                        name: { type: 'string', example: 'Cơ sở Hiệp Phước - HCM' },
                        phone: { type: 'string', example: '0932113444' },
                        is_default: { type: 'boolean', example: false },
                    },
                },
                Contact: {
                    type: 'object',
                    description: 'Địa chỉ / thông tin liên hệ của người dùng',
                    properties: {
                        id: { type: 'integer' },
                        user_id: { type: 'integer' },
                        detail: { type: 'string' },
                        ward_code: { type: 'string' },
                        ward_name: { type: 'string' },
                        district_id: { type: ['string', 'integer'] },
                        district_name: { type: 'string' },
                        province_id: { type: ['string', 'integer'] },
                        province_name: { type: 'string' },
                        name: { type: 'string' },
                        phone: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CartItem: {
                    type: 'object',
                    description: 'Mục trong giỏ hàng',
                    properties: {
                        id: { type: 'integer' },
                        cart_id: { type: 'integer' },
                        post_id: { type: 'integer' },
                        quantity: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Cart: {
                    type: 'object',
                    description: 'Giỏ hàng của người dùng',
                    properties: {
                        id: { type: 'integer' },
                        user_id: { type: 'integer' },
                        items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                OrderDetail: {
                    type: 'object',
                    description: 'Chi tiết đơn hàng',
                    properties: {
                        id: { type: 'integer' },
                        order_id: { type: 'integer' },
                        post_id: { type: 'integer' },
                        price: { type: 'number' },
                        deposit_amount: { type: 'number' },
                        commission_amount: { type: 'number' },
                        appointment_time: {
                            type: ['string', 'null'],
                            format: 'date-time',
                            nullable: true,
                        },
                    },
                },
                Order: {
                    type: 'object',
                    description: 'Đơn hàng (output)',
                    properties: {
                        id: { type: 'integer' },
                        seller_id: { type: 'integer' },
                        buyer_id: { type: ['integer', 'null'], nullable: true },
                        order_type: { type: 'integer' },
                        from_contact_id: { type: 'integer' },
                        to_contact_id: { type: 'integer' },
                        delivery_price: { type: 'number' },
                        total_amount: { type: 'number' },
                        status: { type: 'string' },
                        order_details: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/OrderDetail' },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                OrderStatus: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        code: { type: 'string' },
                        name: { type: 'string' },
                    },
                },
                Transaction: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        order_id: { type: 'integer' },
                        amount: { type: 'number' },
                        type: { type: 'string' },
                        status: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                FavoritePost: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        user_id: { type: 'integer' },
                        post_id: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Package: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        price: { type: 'number' },
                        duration_days: { type: 'integer' },
                    },
                },
                Variation: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        category_id: { type: 'integer' },
                        name: { type: 'string' },
                    },
                },
                VariationValue: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        variation_id: { type: 'integer' },
                        parent_id: { type: ['integer', 'null'], nullable: true },
                        value: { type: 'string' },
                    },
                },
            },
        },
    },

    // Nơi chứa các file có comment Swagger
    apis: ['./routes/*.js', './controllers/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
