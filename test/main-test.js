'use strict';

describe('pos', () => {

  it('should decode 1 barcode with out quantity', () => {
    const tag = ['ITEM000001'];
    const actual = decodeBarcodes(tag);
    const expected = [{
      barcode: 'ITEM000001',
      count: 1
    }];

    expect(actual).toEqual(expected);
  });

  it('should decode multiple barcodes with out quantity', () => {
    const tag = [
      'ITEM000001',
      'ITEM000002',
      'ITEM000002',
      'ITEM000003',
      'ITEM000003',
      'ITEM000003',
    ];
    const actual = decodeBarcodes(tag);
    const expected = [
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000002', count: 1 },
      { barcode: 'ITEM000002', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
    ];

    expect(actual).toEqual(expected);
  });

  it('should decode multiple barcodes with quantity', () => {
    const tag = [
      'ITEM000001',
      'ITEM000002-2',
      'ITEM000003-3.14',
    ];
    const actual = decodeBarcodes(tag);
    const expected = [
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000002', count: 2 },
      { barcode: 'ITEM000003', count: 3.14 },
    ];

    expect(actual).toEqual(expected);
  });

  it('should combine items', () => {
    const decodedBarcodes = [
      { barcode: 'ITEM000002', count: 1 },
      { barcode: 'ITEM000002', count: 1 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
    ];

    const actual = combineBarcodes(decodedBarcodes);
    const expected = [
      { barcode: 'ITEM000002', count: 2 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000003', count: 3 },
    ]

    expect(actual).toEqual(expected);
  });

  it('should get items with count', () => {
    const combinedBarcodes = [
      { barcode: 'ITEM000002', count: 2 },
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000003', count: 3 },
    ];

    const actual = getItemsWithCount(combinedBarcodes);

    const expected = [
      { barcode: 'ITEM000002', name: 'Apple', unit: 'pound', price: 5.50, count: 2 },
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 1 },
      { barcode: 'ITEM000003', name: 'Litchi', unit: 'pound', price: 15.00, count: 3 }
    ];

    expect(actual).toEqual(expected);
  });

  it('should get item with total price', () => {
    const item =
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 }
      ;

    const actual = calculateTotalPrice(item);

    const expected = 15.00;

    expect(actual).toEqual(expected);
  });
  
  it('should get item with total price. Given count with decimal places', () => {
    const item =
      { barcode: 'ITEM000004', name: 'Battery', unit: 'a', price: 2.00, count: 3.1 }
      ;

    const actual = calculateTotalPrice(item);

    const expected = 6.2;

    expect(actual).toEqual(expected);
  });

  it('should get the discounted price of an item', () => {
    const itemWithCount = 
      { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 };

    const actual = calculateDiscountedPrice(itemWithCount);

    const expected = 12.00;

    expect(actual).toEqual(expected);
  });

  // it('should get single receipt item with discounted price', () => {
  //   const itemsWithCount = [
  //     { barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5 },
  //   ]

  //   const actual = getReceiptItems(itemsWithCount);

  //   const expected = [
  //     {
  //       barcode: 'ITEM000001', name: 'Sprite', unit: 'bottle', price: 3.00, count: 5,
  //       normalPrice: 15.00, discountedPrice: 12.00
  //     },
  //   ];

  //   expect(actual).toEqual(expected);
  // });


  it('should print text', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    const actual = printReceipt(tags);

    const expectText = `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`;

    expect(actual).toBe(expectText);
  });
});

