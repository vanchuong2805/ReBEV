import crypto from 'crypto';

const createPayment = async (paymentInfo) => {
    // Momo payment integration
    const partnerCode = process.env.PARTNER_CODE;
    const accessKey = process.env.ACCESS_KEY;
    const secretKey = process.env.SECRET_KEY;
    const requestId = `${partnerCode}${Date.now()}`;

    const rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        paymentInfo.amount +
        '&extraData=' +
        (paymentInfo.extraData || '') +
        '&ipnUrl=' +
        paymentInfo.ipnUrl +
        '&orderId=' +
        (paymentInfo.orderId) +
        '&orderInfo=' +
        paymentInfo.orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        paymentInfo.redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        (paymentInfo.requestType || 'captureWallet');

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    // json object to send to Momo
    const requestBody = {
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: paymentInfo.amount,
        orderId: paymentInfo.orderId || requestId,
        orderInfo: paymentInfo.orderInfo,
        redirectUrl: paymentInfo.redirectUrl,
        ipnUrl: paymentInfo.ipnUrl,
        extraData: paymentInfo.extraData || '',
        requestType: paymentInfo.requestType || 'captureWallet',
        signature: signature,
        lang: 'en',
    };
    // Call Momo API
    const res = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    return data;
};

export default { createPayment };
