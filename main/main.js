'use strict';

function printReceipt(tags){
    return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`;
}

function decodeBarcodes(barcodes){
    const decodedBarcodes=[];

    for(let rawBarcode of barcodes){
        const actualBarcode = rawBarcode.split('-')[0];
        let count = Number(rawBarcode.split('-')[1]);

        if(isNaN(count)){
            count = Number(1);
        }

        decodedBarcodes.push({
            barcode: actualBarcode,
            count: count
        })
    }

    return decodedBarcodes;
}

function combineBarcodes(decodedBarcodes){
    const distinctBarcodes = Array.from(new Set(
        decodedBarcodes.map(db=>db.barcode)
    ));
    const combinedBarcodes = [];

    for(let distinctBarcode of distinctBarcodes){
        const totalCount = decodedBarcodes
            .filter(db=>db.barcode===distinctBarcode)
            .map(db=>db.count)
            .reduce((acc, b)=>acc+b, 0);

        combinedBarcodes.push(
            {barcode: distinctBarcode, count: totalCount}
        );
    }

    return combinedBarcodes;
}

function getItemsWithCount(combinedBarcodes){
    let allItems = loadAllItems();
    let itemsWithCount=[];
    
    for(let combinedBarcode of combinedBarcodes){
        let loadedItem = allItems
            .filter(item=>item.barcode === combinedBarcode.barcode)
            [0];

        loadedItem.count = combinedBarcode.count;
        itemsWithCount.push(loadedItem);
    }

    return itemsWithCount;
}

function calculateTotalPrice(item){
    return item.price*item.count;
}

function calculateDiscountedPrice(item){
    const promotions = loadPromotions();
    for(let promotion of promotions){
        if(promotion.type==="BUY_TWO_GET_ONE_FREE"){
            if(promotion.barcodes.includes(item.barcode)){
                return calculateTotalPrice(item)-Math.floor(item.count/3)*item.price;
            }
        }
    }
    return 0;
}

function getReceiptItems(itemsWithCount){
    let receiptItems=[];
    for(let item of itemsWithCount){
        let receiptItem = item;
        receiptItem.normalPrice = item.price * item.count;
        receiptItem.discountPrice = calculateDiscountedPrice(item);
    }
    return receiptItems;
}
