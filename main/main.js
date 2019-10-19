'use strict';

function decodeBarcodes(barcodes) {
    const decodedBarcodes = [];

    for (let rawBarcode of barcodes) {
        const actualBarcode = rawBarcode.split('-')[0];
        let count = Number(rawBarcode.split('-')[1]);

        if (isNaN(count)) {
            count = Number(1);
        }

        decodedBarcodes.push({
            barcode: actualBarcode,
            count: count
        })
    }

    return decodedBarcodes;
}

function combineBarcodes(decodedBarcodes) {
    const distinctBarcodes = Array.from(new Set(
        decodedBarcodes.map(db => db.barcode)
    ));
    const combinedBarcodes = [];

    for (let distinctBarcode of distinctBarcodes) {
        const totalCount = decodedBarcodes
            .filter(db => db.barcode === distinctBarcode)
            .map(db => db.count)
            .reduce((acc, b) => acc + b, 0);

        combinedBarcodes.push(
            { barcode: distinctBarcode, count: totalCount }
        );
    }

    return combinedBarcodes;
}

function getItemsWithCount(combinedBarcodes) {
    let allItems = loadAllItems();
    let itemsWithCount = [];

    for (let combinedBarcode of combinedBarcodes) {
        let loadedItem = allItems
            .filter(item => item.barcode === combinedBarcode.barcode)
        [0];

        loadedItem.count = combinedBarcode.count;
        itemsWithCount.push(loadedItem);
    }

    return itemsWithCount;
}

function calculateTotalPrice(item) {
    return item.price * item.count;
}

function calculateDiscountedPrice(item) {
    const promotions = loadPromotions();
    for (let promotion of promotions) {
        if (promotion.type === "BUY_TWO_GET_ONE_FREE") {
            if (promotion.barcodes.includes(item.barcode)) {
                return calculateTotalPrice(item) - Math.floor(item.count / 3) * item.price;
            }
        }
    }
    return calculateTotalPrice(item);
}

function getReceiptItems(items) {
    let receiptItems = [];
    for (let item of items) {
        let receiptItem = item;
        receiptItem.normalPrice = calculateTotalPrice(item);
        receiptItem.discountedPrice = calculateDiscountedPrice(item);

        receiptItems.push(receiptItem);
    }
    return receiptItems;
}

function printSingleReceiptItem(item) {
    return `Name: ${item.name}, ` +
        `Quantity: ${item.count} ${item.unit}s, ` +
        `Unit: ${item.price.toFixed(2)}(yuan), ` +
        `Subtotal: ${item.discountedPrice.toFixed(2)}(yuan)`;
}


function printReceipt(items) {
    let receiptItems = getReceiptItems(getItemsWithCount(combineBarcodes(decodeBarcodes(items))));

    let receipt = '***<store earning no money>Receipt ***\n';
    for (let receiptItem of receiptItems) {
        receipt += `${printSingleReceiptItem(receiptItem)}\n`;
    }

    receipt += `----------------------\n`;

    const total = receiptItems
        .map(receiptItem => receiptItem.discountedPrice)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);

    const discountedPrices = receiptItems
        .map(receiptItem => receiptItem.normalPrice-receiptItem.discountedPrice)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);

    receipt += `Total: ${total}(yuan)\n`
    receipt += `Discounted prices: ${discountedPrices}(yuan)\n`
    
    receipt += `**********************`;

    return receipt;
}
