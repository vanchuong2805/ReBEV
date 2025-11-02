export const ERROR_MESSAGE = {
    BLANK_INFORMATION: 'Information cannot be left blank.',
    USER_NOT_FOUND: 'User not found.',
    DISPLAY_NAME_BLANK: 'Display name cannot be left blank.',
    EMAIL_BLANK: 'Email cannot be left blank.',
    PHONE_BLANK: 'Phone number cannot be left blank.',
    PASSWORD_BLANK: 'Password cannot be left blank.',
    EMAIL_EXIST: 'Email already exists.',
    PHONE_EXIST: 'Phone number already exists.',
    REGISTER_FAIL: 'Register failed.',
    PHONE_PASSWORD_INCORRECT: 'Phone number or password is incorrect.',
    LOGIN_FAIL: 'Login failed.',
    EMAIL_PASSWORD_INCORRECT: 'Email or password is incorrect.',
    ADD_CONTACT_DETAIL_FAIL: 'Adding contact detail failed.',
    CONTACT_NAME_BLANK: 'Contact name cannot be left blank.',
    CONTACT_PHONE_BLANK: 'Contact phone cannot be left blank.',
    CONTACT_DETAIL_BLANK: 'Contact detail cannot be left blank.',
    CONTACT_NOT_FOUND: 'Contact ID cannot be found.',
    UPDATE_CONTACT_DETAIL_FAIL: 'Updating contact detail failed.',
    DELETE_CONTACT_FAIL: 'Deleting contact failed.',
    CREATE_CART_FAIL: 'Creating cart failed.',
    CART_ITEM_EXISTED: 'This item is already in the cart.',
    CART_ITEM_NOT_FOUND: 'Cart item not found.',
    DELETE_CART_FAIL: 'Deleting cart item failed.',
    ACCOUNT_LOCKED: 'Your account has been locked. Please contact the administrator.',
    CREATE_FAVORITE_FAIL: 'Creating favorite post failed.',
    FAVORITE_POST_EXISTED: 'This post is already in your favorite list.',
    FAVORITE_POST_NOT_FOUND: 'Favorite post not found.',
    DELETE_FAVORITE_FAIL: 'Deleting favorite post failed.',
    POST_NOT_FOUND: 'Post not found.',
    FAVORITE_NOT_FOUND: 'Favorite not found.',
    UPDATE_USER_FAIL: 'Updating user failed.',
    PACKAGE_NOT_FOUND: 'Package not found.',
    CREATE_STAFF_FAIL: 'Create Staff account failed',
    ACCOUNT_LOCK_FAILED: 'Locking account failed',
    ACCOUNT_ALREADY_LOCKED: 'Account is already locked',
    ACCOUNT_UNLOCK_FAILED: 'Unlocking account failed',
    ACCOUNT_ALREADY_UNLOCKED: 'Account is already unlocked',
    GOOGLE_TOKEN_BLANK: 'Google ID token cannot be left blank',
    GOOGLE_EMAIL_NOT_VERIFIED: 'Google email is not verified',
    LOGIN_GOOGLE_FAIL: 'Login with Google failed',
    EMAIL_EXISTS: 'Email already exists.',
    PHONE_EXISTS: 'Phone number already exists.',
    CREATE_PACKAGE_FAIL: 'Creating package failed',
    DELETE_PACKAGE_FAIL: 'Deleting package failed',
    UPDATE_PACKAGE_FAIL: 'Updating package failed',
    FORGET_PASSWORD_FAILED: 'Resetting password failed',
    CREATE_REVIEW_FAILED: 'Creating review failed',
    UPDATE_REVIEW_FAILED: 'Updating review failed',
}

export const SUCCESS_MESSAGE = {
    REGISTER_SUCCESS: 'Register successful',
    LOGIN_SUCCESS: 'Login successful',
    ADD_CONTACT_DETAIL_SUCCESS: 'Adding contact detail successful',
    UPDATE_CONTACT_DETAIL_SUCCESS: 'Updating contact detail successful',
    DELETE_CONTACT_SUCCESS: 'Deleting contact successful',
    CREATE_CART_SUCCESS: 'Creating cart successful',
    DELETE_CART_SUCCESS: 'Deleting cart item successful',
    CREATE_FAVORITE_SUCCESS: 'Creating favorite post successful',
    DELETE_FAVORITE_SUCCESS: 'Deleting favorite post successful',
    UPDATE_USER_SUCCESS: 'Updating user successful',
    ACCOUNT_LOCKED: 'Account has been locked successfully',
    CREATE_STAFF_SUCCESS: 'Create Staff account successful',
    ACCOUNT_UNLOCKED: 'Account has been unlocked successfully',
    LOGIN_GOOGLE_SUCCESS: 'Login with Google successful',
    CREATE_PACKAGE_SUCCESS: 'Package created successfully',
    DELETE_PACKAGE_SUCCESS: 'Package deleted successfully',
    UPDATE_PACKAGE_SUCCESS: 'Package updated successfully',
    OTP_SENT: 'OTP has been sent successfully',
    PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
    CREATE_REVIEW_SUCCESS: 'Review created successfully',
    UPDATE_REVIEW_SUCCESS: 'Review updated successfully',
}

export const POST_STATUS = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
    SOLD: 3,
    DEPOSITED: 4,
    CANCELLED: 5,
    VERIFIED: 6,
    RESERVED: 7,
};

export const TRANSITION_STATUS = {
    [POST_STATUS.APPROVED]: [POST_STATUS.PENDING, POST_STATUS.REJECTED],
    [POST_STATUS.REJECTED]: [POST_STATUS.PENDING, POST_STATUS.APPROVED, POST_STATUS.VERIFIED],
    [POST_STATUS.CANCELLED]: [POST_STATUS.PENDING],
    [POST_STATUS.VERIFIED]: [POST_STATUS.PENDING, POST_STATUS.APPROVED],
};

export const ROLE = {
    MEMBER: 0,
    STAFF: 1,
    ADMIN: 2,
};

export const ORDER_TYPE = {
    BUY: 1,
    DEPOSIT: 2,
    RETURN: 3,
};

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    CONFIRMED: 'CONFIRMED',
    DELIVERING: 'DELIVERING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    FAIL_PAY: 'FAIL_PAY',
    COMPLETED: 'COMPLETED',
    CUSTOMER_CANCELLED: 'CUSTOMER_CANCELLED',
    SELLER_CANCELLED: 'SELLER_CANCELLED',
    RETURNING: 'RETURNING',
    RETURNED: 'RETURNED',
};

export const ORDER_STATUS_TRANSITION = {
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PAID],
    [ORDER_STATUS.CANCELLED]: [ORDER_STATUS.PENDING, ORDER_STATUS.PAID],
    [ORDER_STATUS.DELIVERING]: [ORDER_STATUS.CONFIRMED],
    [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.DELIVERING],
    [ORDER_STATUS.COMPLETED]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED],
    [ORDER_STATUS.CUSTOMER_CANCELLED]: [ORDER_STATUS.CONFIRMED],
    [ORDER_STATUS.SELLER_CANCELLED]: [ORDER_STATUS.CONFIRMED],
    [ORDER_STATUS.RETURNING]: [ORDER_STATUS.PENDING],
    [ORDER_STATUS.RETURNED]: [ORDER_STATUS.RETURNING],
};

export const ORDER_TYPE_STATUS = {
    [ORDER_TYPE.BUY]: [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PAID,
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.DELIVERING,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.CANCELLED,
    ],
    [ORDER_TYPE.DEPOSIT]: [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PAID,
        ORDER_STATUS.CUSTOMER_CANCELLED,
        ORDER_STATUS.SELLER_CANCELLED,
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.COMPLETED,
    ],
    [ORDER_TYPE.RETURN]: [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.RETURNING,
        ORDER_STATUS.RETURNED,
    ],
};

export const TRANSACTION_STATUS = {
    SUCCESS: 0,
};

export const TRANSACTION_TYPE = {
    BUY: 1,
    DEPOSIT: 2,
    REFUND: 3,
    PACKAGE_FEE: 4,
    RELEASE: 5,
    CASH_OUT: 6,
};


export const COMPLAINT_STATUS = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2,
    CANCELLED: 3,
}

export const COMPLAINT_STATUS_TRANSITION = {
    [COMPLAINT_STATUS.RESOLVED]: [COMPLAINT_STATUS.PENDING],
    [COMPLAINT_STATUS.CANCELLED]: [COMPLAINT_STATUS.PENDING],
    [COMPLAINT_STATUS.REJECTED]: [COMPLAINT_STATUS.PENDING],
    [COMPLAINT_STATUS.RESOLVED]: [COMPLAINT_STATUS.PENDING],
};

export const COMPLAINT_TYPE = {
    REFUND: 0,
}