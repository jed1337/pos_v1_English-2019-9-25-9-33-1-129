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

  it('should combine items', ()=>{
    const decodedBarcodes = [
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000002', count: 1 },
      { barcode: 'ITEM000002', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
      { barcode: 'ITEM000003', count: 1 },
    ];

    const actual = combineBarcodes(decodedBarcodes);
    const expected = [
      { barcode: 'ITEM000001', count: 1 },
      { barcode: 'ITEM000002', count: 2 },
      { barcode: 'ITEM000003', count: 3 },
    ]

    expect(actual).toEqual(expected);
  });

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

