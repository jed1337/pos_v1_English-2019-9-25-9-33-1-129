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
    let decodedBarcodes=[];

    for(let rawBarcode of barcodes){
        let actualBarcode = rawBarcode.split('-')[0];
        let count = rawBarcode.split('-')[1];

        if(count===undefined){
            count = 1;
        }

        decodedBarcodes.push({
            barcode: actualBarcode,
            count: count
        })
    }

    return decodedBarcodes;
}

// module.exports = {
//     printReceipt: printReceipt
// };